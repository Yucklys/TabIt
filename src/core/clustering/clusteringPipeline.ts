import type { TabProps } from '$type/tabProps';
import { buildSimilarityScorer, nameCommunities } from './tfidfSimilarity';
import { buildKnnGraph, leiden, extractCommunities } from './leiden';
import { filterCommunitiesBySize } from './clusterFilter';

/**
 * Main clustering pipeline entry point (Leiden community detection)
 * @param tabs - Array of tab properties
 * @param tabRange - [min, max] tabs per cluster
 * @param similarityThreshold - Controls resolution (0.0-1.0): higher = more, smaller clusters
 * @returns Categorized result in same format as existing categorization
 */
export async function clusterAndGroup(
  tabs: TabProps[],
  tabRange: [number, number],
  similarityThreshold: number = 0.5
): Promise<{ [category: string]: [number, ...number[]] }> {
  // Phase 1: Build TF-IDF similarity scorer
  const scorer = buildSimilarityScorer(tabs);

  // Phase 2: Build k-NN graph
  const graph = buildKnnGraph(scorer);

  // Phase 3: Run Leiden with resolution = similarityThreshold
  const assignment = leiden(graph, similarityThreshold);
  const communities = extractCommunities(assignment, graph);

  // Phase 4: Filter communities by size
  const { validCommunities } = filterCommunitiesBySize(
    communities,
    tabRange[0],
    tabRange[1]
  );

  // Phase 5: Name communities + convert to output format
  const communityNames = nameCommunities(validCommunities, tabs, scorer);

  const result: { [category: string]: [number, ...number[]] } = {};

  for (let i = 0; i < validCommunities.length; i++) {
    const community = validCommunities[i];
    const name = communityNames[i];

    // Convert tab indices to tab IDs
    const tabIds = community.map(idx => tabs[idx].id);

    if (tabIds.length > 0) {
      if (!result[name]) {
        result[name] = tabIds as [number, ...number[]];
      } else {
        result[name].push(...tabIds);
      }
    }
  }

  return result;
}
