import type { TabSimilarityScorer } from './tfidfSimilarity';

// --- Types ---

export type Community = number[]; // array of tab indices

export type WeightedGraph = {
  size: number;
  neighbors: Map<number, Map<number, number>>; // node → neighbor → weight
};

// --- Graph Construction ---

const DEFAULT_K = 5;
const DEFAULT_THRESHOLD = 0.15;

/**
 * Build a k-NN graph from tab similarities.
 * An undirected edge exists between i and j if i ∈ kNN(j) OR j ∈ kNN(i)
 * and their similarity exceeds the threshold.
 * Edge weight = raw similarity score.
 */
export function buildKnnGraph(
  scorer: TabSimilarityScorer,
  k: number = DEFAULT_K,
  threshold: number = DEFAULT_THRESHOLD
): WeightedGraph {
  const n = scorer.size;
  const neighbors = new Map<number, Map<number, number>>();

  // Initialize neighbor maps
  for (let i = 0; i < n; i++) {
    neighbors.set(i, new Map());
  }

  // For each node, find k nearest neighbors
  for (let i = 0; i < n; i++) {
    const nearest = scorer.kNearest(i, k);
    for (const { index: j, score } of nearest) {
      if (score <= threshold) continue;
      // Add symmetric edge (only if not already present with higher weight)
      const existing = neighbors.get(i)!.get(j);
      if (existing === undefined || score > existing) {
        neighbors.get(i)!.set(j, score);
        neighbors.get(j)!.set(i, score);
      }
    }
  }

  return { size: n, neighbors };
}

/**
 * Compute weighted degree of a node (sum of all edge weights).
 */
export function weightedDegree(graph: WeightedGraph, node: number): number {
  let deg = 0;
  const nodeNeighbors = graph.neighbors.get(node);
  if (!nodeNeighbors) return 0;
  for (const w of nodeNeighbors.values()) {
    deg += w;
  }
  return deg;
}

/**
 * Total weight of all edges in the graph (each edge counted once).
 */
export function totalWeight(graph: WeightedGraph): number {
  let total = 0;
  for (const [node, nodeNeighbors] of graph.neighbors) {
    for (const [neighbor, w] of nodeNeighbors) {
      if (neighbor > node) {
        total += w;
      }
    }
  }
  return total;
}

// --- Leiden Algorithm ---

/**
 * Compute modularity gain of moving node to targetCommunity.
 * Uses the standard modularity formula with resolution parameter.
 *
 * ΔQ = [k_{i,in} / m - resolution * (Σ_tot * k_i) / (2m²)]
 *
 * where:
 * - k_{i,in} = sum of edge weights from node to nodes in targetCommunity
 * - Σ_tot = sum of weighted degrees of nodes in targetCommunity
 * - k_i = weighted degree of node
 * - m = total edge weight
 */
export function modularityGain(
  graph: WeightedGraph,
  node: number,
  targetCommunity: Set<number>,
  resolution: number,
  m: number
): number {
  if (m === 0) return 0;

  const nodeNeighbors = graph.neighbors.get(node)!;
  const ki = weightedDegree(graph, node);

  // k_{i,in}: sum of edge weights from node to target community members
  let kiIn = 0;
  for (const member of targetCommunity) {
    const w = nodeNeighbors.get(member);
    if (w !== undefined) kiIn += w;
  }

  // Σ_tot: sum of weighted degrees in target community
  let sigmaTot = 0;
  for (const member of targetCommunity) {
    sigmaTot += weightedDegree(graph, member);
  }

  return kiIn / m - resolution * (sigmaTot * ki) / (2 * m * m);
}

/**
 * Phase 1: Local moving — greedily move nodes to neighbor communities
 * to maximize modularity.
 * Returns true if any moves were made.
 */
function localMoving(
  graph: WeightedGraph,
  communities: number[],
  resolution: number,
  m: number
): boolean {
  const n = graph.size;
  let improved = false;
  let changed = true;

  while (changed) {
    changed = false;

    // Build community → members lookup
    const communityMembers = new Map<number, Set<number>>();
    for (let i = 0; i < n; i++) {
      const c = communities[i];
      if (!communityMembers.has(c)) communityMembers.set(c, new Set());
      communityMembers.get(c)!.add(i);
    }

    // Process nodes in random order for better convergence
    const order = Array.from({ length: n }, (_, i) => i);
    shuffleArray(order);

    for (const node of order) {
      const currentCommunity = communities[node];
      const nodeNeighbors = graph.neighbors.get(node);
      if (!nodeNeighbors || nodeNeighbors.size === 0) continue;

      // Collect neighboring communities
      const neighborCommunities = new Set<number>();
      for (const neighbor of nodeNeighbors.keys()) {
        neighborCommunities.add(communities[neighbor]);
      }

      // Compute gain of removing node from current community
      const currentMembers = communityMembers.get(currentCommunity)!;
      const currentMembersWithout = new Set(currentMembers);
      currentMembersWithout.delete(node);

      const removeCost = currentMembersWithout.size > 0
        ? -modularityGain(graph, node, currentMembersWithout, resolution, m)
        : 0;

      // Find best community to move to
      let bestGain = 0;
      let bestCommunity = currentCommunity;

      for (const targetComm of neighborCommunities) {
        if (targetComm === currentCommunity) continue;
        const targetMembers = communityMembers.get(targetComm)!;
        const gain = modularityGain(graph, node, targetMembers, resolution, m) + removeCost;

        if (gain > bestGain) {
          bestGain = gain;
          bestCommunity = targetComm;
        }
      }

      if (bestCommunity !== currentCommunity) {
        // Move node
        currentMembers.delete(node);
        if (currentMembers.size === 0) communityMembers.delete(currentCommunity);

        communities[node] = bestCommunity;
        communityMembers.get(bestCommunity)!.add(node);

        changed = true;
        improved = true;
      }
    }
  }

  return improved;
}

/**
 * Phase 2: Refinement — within each community, start as singletons
 * and merge only if it improves modularity (ensures well-connected communities).
 */
function refinement(
  graph: WeightedGraph,
  communities: number[],
  resolution: number,
  m: number
): void {
  const n = graph.size;

  // Build community → members
  const communityMembers = new Map<number, Set<number>>();
  for (let i = 0; i < n; i++) {
    const c = communities[i];
    if (!communityMembers.has(c)) communityMembers.set(c, new Set());
    communityMembers.get(c)!.add(i);
  }

  // For each community, refine internally
  for (const [, members] of communityMembers) {
    if (members.size <= 1) continue;

    const memberArray = Array.from(members);

    // Start each node as its own sub-community
    const subCommunities = new Map<number, number>();
    for (const node of memberArray) {
      subCommunities.set(node, node);
    }

    let changed = true;
    while (changed) {
      changed = false;

      for (const node of memberArray) {
        const currentSub = subCommunities.get(node)!;

        // Build sub-community members
        const subMembers = new Map<number, Set<number>>();
        for (const [n2, sc] of subCommunities) {
          if (!subMembers.has(sc)) subMembers.set(sc, new Set());
          subMembers.get(sc)!.add(n2);
        }

        const currentSubMembers = subMembers.get(currentSub)!;
        const currentSubWithout = new Set(currentSubMembers);
        currentSubWithout.delete(node);

        const removeCost = currentSubWithout.size > 0
          ? -modularityGain(graph, node, currentSubWithout, resolution, m)
          : 0;

        // Only consider sub-communities of neighbors within this community
        const nodeNeighbors = graph.neighbors.get(node)!;
        const neighborSubs = new Set<number>();
        for (const neighbor of nodeNeighbors.keys()) {
          if (members.has(neighbor)) {
            neighborSubs.add(subCommunities.get(neighbor)!);
          }
        }

        let bestGain = 0;
        let bestSub = currentSub;

        for (const targetSub of neighborSubs) {
          if (targetSub === currentSub) continue;
          const targetMembers = subMembers.get(targetSub)!;
          const gain = modularityGain(graph, node, targetMembers, resolution, m) + removeCost;

          if (gain > bestGain) {
            bestGain = gain;
            bestSub = targetSub;
          }
        }

        if (bestSub !== currentSub) {
          subCommunities.set(node, bestSub);
          changed = true;
        }
      }
    }

    // Apply sub-community assignments back to main communities
    // Map sub-community IDs to canonical community IDs
    const subToCanonical = new Map<number, number>();
    for (const [node, sub] of subCommunities) {
      if (!subToCanonical.has(sub)) {
        subToCanonical.set(sub, node);
      }
      communities[node] = subToCanonical.get(sub)!;
    }
  }
}

/**
 * Phase 3: Build aggregated (coarsened) graph where communities become super-nodes.
 */
function aggregateGraph(
  graph: WeightedGraph,
  communities: number[]
): { coarsenedGraph: WeightedGraph; communityMap: Map<number, number>; reverseMap: Map<number, number[]> } {
  // Map community IDs to contiguous super-node IDs
  const uniqueCommunities = [...new Set(communities)];
  const communityMap = new Map<number, number>(); // original community → super-node
  for (let i = 0; i < uniqueCommunities.length; i++) {
    communityMap.set(uniqueCommunities[i], i);
  }

  // Track which original nodes belong to each super-node
  const reverseMap = new Map<number, number[]>();
  for (let i = 0; i < communities.length; i++) {
    const superNode = communityMap.get(communities[i])!;
    if (!reverseMap.has(superNode)) reverseMap.set(superNode, []);
    reverseMap.get(superNode)!.push(i);
  }

  const superSize = uniqueCommunities.length;
  const superNeighbors = new Map<number, Map<number, number>>();
  for (let i = 0; i < superSize; i++) {
    superNeighbors.set(i, new Map());
  }

  // Sum edge weights between super-nodes
  for (const [node, nodeNeighbors] of graph.neighbors) {
    const superA = communityMap.get(communities[node])!;
    for (const [neighbor, w] of nodeNeighbors) {
      const superB = communityMap.get(communities[neighbor])!;
      if (superA === superB) continue; // skip intra-community edges
      if (superA < superB) {
        const existing = superNeighbors.get(superA)!.get(superB) ?? 0;
        superNeighbors.get(superA)!.set(superB, existing + w);
        superNeighbors.get(superB)!.set(superA, existing + w);
      }
    }
  }

  // Edge weights are double-counted (each edge traversed from both sides), halve them
  for (const [, neighbors] of superNeighbors) {
    for (const [neighbor, w] of neighbors) {
      neighbors.set(neighbor, w / 2);
    }
  }

  return {
    coarsenedGraph: { size: superSize, neighbors: superNeighbors },
    communityMap,
    reverseMap,
  };
}

/**
 * Fisher-Yates shuffle (in-place).
 */
function shuffleArray(arr: number[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
}

/**
 * Run the Leiden algorithm on a weighted graph.
 *
 * @param graph - The weighted graph (typically a k-NN similarity graph)
 * @param resolution - Controls granularity: higher = more, smaller clusters
 * @returns Community assignment for each node (node index → community label)
 */
export function leiden(graph: WeightedGraph, resolution: number = 0.5): number[] {
  const n = graph.size;
  if (n === 0) return [];
  if (n === 1) return [0];

  // Initialize: each node is its own community
  const communities = Array.from({ length: n }, (_, i) => i);

  const m = totalWeight(graph);
  if (m === 0) {
    // No edges — every node is its own community
    return communities;
  }

  // Phase 1: Local moving
  const moved = localMoving(graph, communities, resolution, m);

  if (!moved) {
    // No improvement possible
    return communities;
  }

  // Phase 2: Refinement
  refinement(graph, communities, resolution, m);

  // Check if we reduced the number of communities
  const uniqueCount = new Set(communities).size;
  if (uniqueCount >= n) {
    // No aggregation possible
    return communities;
  }

  // Phase 3: Aggregate and recurse
  const { coarsenedGraph, reverseMap } = aggregateGraph(graph, communities);

  // Recurse on coarsened graph
  const coarsenedCommunities = leiden(coarsenedGraph, resolution);

  // Map back to original nodes
  const result = new Array<number>(n);
  for (let superNode = 0; superNode < coarsenedGraph.size; superNode++) {
    const originalNodes = reverseMap.get(superNode)!;
    const finalCommunity = coarsenedCommunities[superNode];
    for (const node of originalNodes) {
      result[node] = finalCommunity;
    }
  }

  return result;
}

/**
 * Extract communities from a Leiden assignment array.
 * Filters out degree-0 nodes (outliers with no edges).
 *
 * @returns Array of communities, each being an array of tab indices
 */
export function extractCommunities(
  assignment: number[],
  graph: WeightedGraph
): Community[] {
  const communityMap = new Map<number, number[]>();

  for (let i = 0; i < assignment.length; i++) {
    const c = assignment[i];
    if (!communityMap.has(c)) communityMap.set(c, []);
    communityMap.get(c)!.push(i);
  }

  // Filter out singleton communities where the node has degree 0 (outliers)
  const communities: Community[] = [];
  for (const members of communityMap.values()) {
    const isOutlierSingleton = members.length === 1
      && (graph.neighbors.get(members[0])?.size ?? 0) === 0;
    if (!isOutlierSingleton) {
      communities.push(members);
    }
  }

  return communities;
}
