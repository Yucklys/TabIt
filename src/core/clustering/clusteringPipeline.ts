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
  console.log('=== Starting Clustering Pipeline (Leiden) ===');
  console.log(`Input: ${tabs.length} tabs, tabRange: [${tabRange[0]}, ${tabRange[1]}], threshold: ${similarityThreshold}`);

  // Phase 1: Build TF-IDF similarity scorer
  console.log(`\n[Phase 1] Building TF-IDF similarity scorer...`);
  const scorer = buildSimilarityScorer(tabs);

  // Phase 2: Build k-NN graph
  console.log(`\n[Phase 2] Building k-NN graph...`);
  const graph = buildKnnGraph(scorer);

  // Phase 3: Run Leiden with resolution = similarityThreshold
  console.log(`\n[Phase 3] Running Leiden community detection (resolution: ${similarityThreshold})...`);
  const assignment = leiden(graph, similarityThreshold);
  const communities = extractCommunities(assignment, graph);
  console.log(`Found ${communities.length} communities`);

  // Phase 4: Filter communities by size
  console.log(`\n[Phase 4] Filtering communities by size...`);
  const { validCommunities, outlierTabIndices } = filterCommunitiesBySize(
    communities,
    tabRange[0]
  );

  // Phase 5: Name communities + convert to output format
  console.log(`\n[Phase 5] Naming communities...`);
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

  console.log(`\n=== Clustering Pipeline Complete ===`);
  console.log(`Created ${Object.keys(result).length} categories, ${outlierTabIndices.length} outlier tabs`);
  console.log('Categories:', Object.keys(result));

  return result;
}
