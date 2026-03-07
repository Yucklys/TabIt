import type { TabProps } from '$type/tabProps';
import type { WeightedGraph } from './leiden';
import { buildKnnGraph, totalWeight, weightedDegree, modularityGain } from './leiden';
import { buildSimilarityScorer, nameCommunities } from './tfidfSimilarity';
import { filterCommunitiesBySize } from './clusterFilter';
import { clusterAndGroup } from './clusteringPipeline';

// --- Types ---

export interface ExistingGroupInfo {
  name: string;
  tabs: TabProps[];
}

export interface IncrementalResult {
  /** groupIndex (into existingGroups array) → new tab IDs to add */
  merged: Array<{ groupIndex: number; tabIds: number[] }>;
  /** newGroupName → tab IDs */
  created: Record<string, [number, ...number[]]>;
}

// --- Helpers ---

function shuffleArray(arr: number[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
}

// --- Constrained Local Moving ---

/**
 * Run constrained local moving: only new tab nodes can move,
 * existing group tabs are frozen in their communities.
 *
 * @param graph - k-NN graph over all tabs (existing + new)
 * @param communities - community assignment array (mutated in place)
 * @param frozenCount - number of nodes at the start that are frozen
 * @param resolution - Leiden resolution parameter
 * @param m - total edge weight in graph
 */
function constrainedLocalMoving(
  graph: WeightedGraph,
  communities: number[],
  frozenCount: number,
  resolution: number,
  m: number
): void {
  if (m === 0) return;

  const n = graph.size;
  const movableIndices: number[] = [];
  for (let i = frozenCount; i < n; i++) {
    movableIndices.push(i);
  }

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

    // Shuffle movable nodes for convergence
    shuffleArray(movableIndices);

    for (const node of movableIndices) {
      const currentCommunity = communities[node];
      const nodeNeighbors = graph.neighbors.get(node);
      if (!nodeNeighbors || nodeNeighbors.size === 0) continue;

      // Collect neighboring communities
      const neighborCommunities = new Set<number>();
      for (const neighbor of nodeNeighbors.keys()) {
        neighborCommunities.add(communities[neighbor]);
      }

      // Compute cost of removing node from current community
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
      }
    }
  }
}

// --- Main Entry Point ---

/**
 * Incremental clustering: builds similarity graph from ALL tabs (existing + new),
 * freezes existing group assignments, and runs constrained local moving so new tabs
 * either merge into existing groups or form new communities.
 *
 * Falls back to full Leiden pipeline when no existing groups are present.
 */
export async function incrementalClusterAndGroup(
  newTabs: TabProps[],
  existingGroups: ExistingGroupInfo[],
  tabRange: [number, number],
  resolution: number
): Promise<IncrementalResult> {
  // Fast path: no existing groups → full Leiden pipeline
  if (existingGroups.length === 0) {
    const fullResult = await clusterAndGroup(newTabs, tabRange, resolution);
    return {
      merged: [],
      created: fullResult as Record<string, [number, ...number[]]>,
    };
  }

  // Build combined tab list: existing groups first, then new tabs
  const existingTabs = existingGroups.flatMap(g => g.tabs);
  const allTabs = [...existingTabs, ...newTabs];
  const frozenCount = existingTabs.length;
  const newStartIndex = frozenCount;

  // Phase 1: Build TF-IDF scorer over full corpus
  const scorer = buildSimilarityScorer(allTabs);

  // Phase 2: Build k-NN graph
  const graph = buildKnnGraph(scorer);

  // Phase 3: Initialize community assignments
  // Existing group tabs → community = groupIndex
  // New tabs → unique singleton communities
  const communities: number[] = new Array(allTabs.length);

  let offset = 0;
  for (let groupIdx = 0; groupIdx < existingGroups.length; groupIdx++) {
    const group = existingGroups[groupIdx];
    for (let t = 0; t < group.tabs.length; t++) {
      communities[offset + t] = groupIdx;
    }
    offset += group.tabs.length;
  }

  // Each new tab gets a unique singleton community
  for (let j = 0; j < newTabs.length; j++) {
    communities[newStartIndex + j] = existingGroups.length + j;
  }

  // Phase 4: Constrained local moving
  const m = totalWeight(graph);
  constrainedLocalMoving(graph, communities, frozenCount, resolution, m);

  // Phase 5: Collect results
  // New tabs assigned to community < existingGroups.length → merged
  // New tabs assigned to community >= existingGroups.length → potential new groups
  const mergedMap = new Map<number, number[]>(); // groupIndex → tab IDs
  const newCommunityMap = new Map<number, number[]>(); // community → tab indices (into allTabs)

  for (let j = 0; j < newTabs.length; j++) {
    const tabIndex = newStartIndex + j;
    const comm = communities[tabIndex];

    if (comm < existingGroups.length) {
      // Merged into existing group
      if (!mergedMap.has(comm)) mergedMap.set(comm, []);
      mergedMap.get(comm)!.push(newTabs[j].id);
    } else {
      // Potential new group
      if (!newCommunityMap.has(comm)) newCommunityMap.set(comm, []);
      newCommunityMap.get(comm)!.push(tabIndex);
    }
  }

  // Build merged result
  const merged: IncrementalResult['merged'] = [];
  for (const [groupIndex, tabIds] of mergedMap) {
    merged.push({ groupIndex, tabIds });
  }

  // Filter new communities by min size, then name them
  const newCommunities = Array.from(newCommunityMap.values());
  const { validCommunities } = filterCommunitiesBySize(newCommunities, tabRange[0]);

  const existingNames = existingGroups.map(g => g.name);
  const communityNames = nameCommunities(validCommunities, allTabs, scorer, existingNames);

  const created: Record<string, [number, ...number[]]> = {};
  for (let i = 0; i < validCommunities.length; i++) {
    const name = communityNames[i];
    const tabIds = validCommunities[i].map(idx => allTabs[idx].id);
    if (tabIds.length > 0) {
      created[name] = tabIds as [number, ...number[]];
    }
  }

  return { merged, created };
}
