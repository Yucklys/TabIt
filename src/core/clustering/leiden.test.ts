import { test, expect, describe } from 'bun:test';
import { buildKnnGraph, leiden, extractCommunities } from './leiden';
import type { WeightedGraph } from './leiden';
import { buildSimilarityScorer } from './tfidfSimilarity';
import type { TabProps } from '$type/tabProps';

function makeTabs(specs: Array<{ title: string; domain: string; path: string }>): TabProps[] {
  return specs.map((s, i) => ({ id: i + 1, title: s.title, domain: s.domain, path: s.path }));
}

/**
 * Helper to build a simple weighted graph from an edge list.
 */
function makeGraph(size: number, edges: Array<[number, number, number]>): WeightedGraph {
  const neighbors = new Map<number, Map<number, number>>();
  for (let i = 0; i < size; i++) {
    neighbors.set(i, new Map());
  }
  for (const [a, b, w] of edges) {
    neighbors.get(a)!.set(b, w);
    neighbors.get(b)!.set(a, w);
  }
  return { size, neighbors };
}

// --- Graph Construction ---

describe('buildKnnGraph', () => {
  const tabs = makeTabs([
    { title: 'React Documentation', domain: 'react.dev', path: '/docs/getting-started' },
    { title: 'React Hooks Reference', domain: 'react.dev', path: '/docs/hooks' },
    { title: 'TypeScript Handbook', domain: 'typescriptlang.org', path: '/docs/handbook' },
    { title: 'Buy Running Shoes', domain: 'amazon.com', path: '/shoes/running' },
    { title: 'Best Running Shoes 2024', domain: 'runnersworld.com', path: '/gear/shoes' },
  ]);

  const scorer = buildSimilarityScorer(tabs);

  test('creates graph with correct number of nodes', () => {
    const graph = buildKnnGraph(scorer, 3, 0.1);
    expect(graph.size).toBe(5);
  });

  test('edges are symmetric', () => {
    const graph = buildKnnGraph(scorer, 3, 0.1);
    for (const [node, nodeNeighbors] of graph.neighbors) {
      for (const [neighbor, weight] of nodeNeighbors) {
        expect(graph.neighbors.get(neighbor)!.get(node)).toBe(weight);
      }
    }
  });

  test('no self-loops', () => {
    const graph = buildKnnGraph(scorer, 3, 0.1);
    for (const [node, nodeNeighbors] of graph.neighbors) {
      expect(nodeNeighbors.has(node)).toBe(false);
    }
  });

  test('similar tabs are connected', () => {
    const graph = buildKnnGraph(scorer, 3, 0.1);
    // React tabs (0, 1) should be connected
    expect(graph.neighbors.get(0)!.has(1)).toBe(true);
    // Running shoes tabs (3, 4) should be connected
    expect(graph.neighbors.get(3)!.has(4)).toBe(true);
  });

  test('high threshold produces fewer edges', () => {
    const lowThreshold = buildKnnGraph(scorer, 3, 0.1);
    const highThreshold = buildKnnGraph(scorer, 3, 0.5);

    let lowEdges = 0;
    let highEdges = 0;
    for (const [, neighbors] of lowThreshold.neighbors) lowEdges += neighbors.size;
    for (const [, neighbors] of highThreshold.neighbors) highEdges += neighbors.size;

    expect(highEdges).toBeLessThanOrEqual(lowEdges);
  });

  test('edge weights are raw similarity scores', () => {
    const graph = buildKnnGraph(scorer, 3, 0.1);
    for (const [node, nodeNeighbors] of graph.neighbors) {
      for (const [neighbor, weight] of nodeNeighbors) {
        const expected = scorer.similarity(node, neighbor);
        expect(weight).toBeCloseTo(expected, 10);
      }
    }
  });
});

// --- Leiden Algorithm ---

describe('leiden', () => {
  test('finds two clear communities', () => {
    // Two cliques connected by a weak edge
    const graph = makeGraph(6, [
      // Clique 1: nodes 0, 1, 2
      [0, 1, 1.0], [0, 2, 1.0], [1, 2, 1.0],
      // Clique 2: nodes 3, 4, 5
      [3, 4, 1.0], [3, 5, 1.0], [4, 5, 1.0],
      // Weak bridge
      [2, 3, 0.1],
    ]);

    const assignment = leiden(graph, 2.0);
    // Nodes within each clique should be in the same community
    expect(assignment[0]).toBe(assignment[1]);
    expect(assignment[0]).toBe(assignment[2]);
    expect(assignment[3]).toBe(assignment[4]);
    expect(assignment[3]).toBe(assignment[5]);
    // The two cliques should be in different communities
    expect(assignment[0]).not.toBe(assignment[3]);
  });

  test('single node returns singleton community', () => {
    const graph = makeGraph(1, []);
    const assignment = leiden(graph, 0.5);
    expect(assignment).toEqual([0]);
  });

  test('empty graph returns empty array', () => {
    const graph = makeGraph(0, []);
    const assignment = leiden(graph, 0.5);
    expect(assignment).toEqual([]);
  });

  test('disconnected nodes each get their own community', () => {
    // No edges — each node stays as its own community
    const graph = makeGraph(4, []);
    const assignment = leiden(graph, 0.5);
    const unique = new Set(assignment);
    expect(unique.size).toBe(4);
  });

  test('fully connected graph puts all nodes together at low resolution', () => {
    const graph = makeGraph(4, [
      [0, 1, 1.0], [0, 2, 1.0], [0, 3, 1.0],
      [1, 2, 1.0], [1, 3, 1.0], [2, 3, 1.0],
    ]);
    const assignment = leiden(graph, 0.1);
    const unique = new Set(assignment);
    // At very low resolution, should merge into one community
    expect(unique.size).toBe(1);
  });

  test('higher resolution produces more communities', () => {
    // Build a graph with 3 loosely connected clusters
    const graph = makeGraph(9, [
      // Cluster 1
      [0, 1, 1.0], [0, 2, 1.0], [1, 2, 1.0],
      // Cluster 2
      [3, 4, 1.0], [3, 5, 1.0], [4, 5, 1.0],
      // Cluster 3
      [6, 7, 1.0], [6, 8, 1.0], [7, 8, 1.0],
      // Weak inter-cluster edges
      [2, 3, 0.05], [5, 6, 0.05],
    ]);

    const lowRes = leiden(graph, 0.3);
    const highRes = leiden(graph, 1.5);

    const lowCount = new Set(lowRes).size;
    const highCount = new Set(highRes).size;

    expect(highCount).toBeGreaterThanOrEqual(lowCount);
  });
});

// --- extractCommunities ---

describe('extractCommunities', () => {
  test('groups nodes by community', () => {
    const graph = makeGraph(4, [
      [0, 1, 1.0], [2, 3, 1.0],
    ]);
    const assignment = [0, 0, 1, 1];
    const communities = extractCommunities(assignment, graph);
    expect(communities).toHaveLength(2);
    // Check that each community contains the right nodes
    const sorted = communities.map(c => c.sort()).sort((a, b) => a[0] - b[0]);
    expect(sorted).toEqual([[0, 1], [2, 3]]);
  });

  test('filters out degree-0 singleton outliers', () => {
    const graph = makeGraph(3, [
      [0, 1, 1.0],
      // Node 2 has no edges (outlier)
    ]);
    const assignment = [0, 0, 2]; // node 2 is its own community
    const communities = extractCommunities(assignment, graph);
    // Should only contain the community of [0, 1], not the outlier singleton [2]
    expect(communities).toHaveLength(1);
    expect(communities[0].sort()).toEqual([0, 1]);
  });

  test('keeps singletons that have edges', () => {
    // Node 2 has an edge but ended up alone in its community
    const graph = makeGraph(3, [
      [0, 1, 1.0], [1, 2, 0.5],
    ]);
    const assignment = [0, 0, 2];
    const communities = extractCommunities(assignment, graph);
    // Node 2 has edges, so it should not be filtered
    expect(communities).toHaveLength(2);
  });
});

// --- Integration: buildKnnGraph + leiden ---

describe('integration', () => {
  test('clusters related tabs together', () => {
    const tabs = makeTabs([
      // React cluster
      { title: 'React Documentation', domain: 'react.dev', path: '/docs' },
      { title: 'React Tutorial Intro', domain: 'react.dev', path: '/tutorial' },
      { title: 'React Hooks Guide', domain: 'react.dev', path: '/hooks' },
      // Shopping cluster
      { title: 'Buy Running Shoes', domain: 'amazon.com', path: '/shoes/running' },
      { title: 'Best Running Shoes Review', domain: 'runnersworld.com', path: '/shoes/best' },
      { title: 'Running Shoes Sale', domain: 'nike.com', path: '/shoes/sale' },
      // Cooking cluster
      { title: 'Easy Pasta Recipes', domain: 'allrecipes.com', path: '/pasta' },
      { title: 'Pasta Cooking Tips', domain: 'foodnetwork.com', path: '/tips/pasta' },
      { title: 'Italian Pasta Guide', domain: 'seriouseats.com', path: '/italian/pasta' },
    ]);

    const scorer = buildSimilarityScorer(tabs);
    const graph = buildKnnGraph(scorer, 5, 0.1);
    const assignment = leiden(graph, 0.5);
    const communities = extractCommunities(assignment, graph);

    // Should produce at least 2 communities (likely 3)
    expect(communities.length).toBeGreaterThanOrEqual(2);

    // React tabs should be together
    const reactCommunity = assignment[0];
    expect(assignment[1]).toBe(reactCommunity);
    expect(assignment[2]).toBe(reactCommunity);

    // Running shoes tabs should be together
    const shoesCommunity = assignment[3];
    expect(assignment[4]).toBe(shoesCommunity);
    expect(assignment[5]).toBe(shoesCommunity);

    // React and shoes should be in different communities
    expect(reactCommunity).not.toBe(shoesCommunity);
  });

  test('handles single tab', () => {
    const tabs = makeTabs([
      { title: 'Only Tab', domain: 'example.com', path: '/' },
    ]);

    const scorer = buildSimilarityScorer(tabs);
    const graph = buildKnnGraph(scorer, 5, 0.1);
    const assignment = leiden(graph, 0.5);

    expect(assignment).toHaveLength(1);
  });

  test('handles two identical tabs', () => {
    const tabs = makeTabs([
      { title: 'Same Title', domain: 'same.com', path: '/same' },
      { title: 'Same Title', domain: 'same.com', path: '/same' },
    ]);

    const scorer = buildSimilarityScorer(tabs);
    const graph = buildKnnGraph(scorer, 5, 0.1);
    const assignment = leiden(graph, 0.5);

    // Identical tabs should be in the same community
    expect(assignment[0]).toBe(assignment[1]);
  });
});
