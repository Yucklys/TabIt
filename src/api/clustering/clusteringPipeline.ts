import type { TabProps } from '@/type/tabProps';
import { groupTabsByDomain, getTabIds } from './domainGrouper';
import { buildSimilarityMatrix } from './vectorSimilarityScorer';
// import { buildSimilarityMatrix } from './similarityScorer';
import { hierarchicalClustering } from './hierarchicalClustering';
import type { Cluster } from './hierarchicalClustering';
import type { DomainGroup } from './domainGrouper';
import { filterClustersBySize } from './clusterFilter';
import { nameClusters } from './categoryNamer';
import { getCustomGroups } from '../storage';

/**
 * Main clustering pipeline entry point
 * @param tabs - Array of tab properties
 * @param tabRange - [min, max] tabs per cluster
 * @param similarityThreshold - Minimum similarity to merge clusters (0.0-1.0)
 * @returns Categorized result in same format as existing categorization
 */
export async function clusterAndGroup(
  tabs: TabProps[],
  tabRange: [number, number],
  similarityThreshold: number = 0.7
): Promise<{ [category: string]: [number, ...number[]] }> {
  console.log('=== Starting Clustering Pipeline ===');
  console.log(`Input: ${tabs.length} tabs, tabRange: [${tabRange[0]}, ${tabRange[1]}], threshold: ${similarityThreshold}`);

  // Phase 1: Group by domain
  const domainGroups = groupTabsByDomain(tabs);
  console.log(`\n[Phase 1] Domain grouping: ${domainGroups.length} domain groups`);

  // Phase 2: Build similarity matrix
  console.log(`\n[Phase 2] Building similarity matrix...`);
  const similarityMatrix = await buildSimilarityMatrix(domainGroups);

  // Phase 3: HAC clustering
  console.log(`\n[Phase 3] Running hierarchical clustering...`);
  const clusters = hierarchicalClustering(domainGroups, similarityMatrix, similarityThreshold, tabRange[1]);

  // Phase 4: Filter by minimum size
  console.log(`\n[Phase 4] Filtering clusters by minimum size...`);
  const { validClusters, outlierTabs } = filterClustersBySize(
    clusters,
    tabRange[0]
  );

  // Phase 5: Name clusters
  console.log(`\n[Phase 5] Naming clusters...`);
  const customGroups = await getCustomGroups();
  const clusterNames = await nameClusters(validClusters, customGroups, tabRange[1]);

  // Phase 6: Convert to expected format
  console.log(`\n[Phase 6] Converting to output format...`);
  const result: { [category: string]: [number, ...number[]] } = {};

  const entries: [Cluster, string][] = [];
  clusterNames.forEach((name, cluster) => {
    entries.push([cluster, name]);
  });

  for (let i = 0; i < entries.length; i++) {
    const cluster = entries[i][0];
    const name = entries[i][1];

    const allTabIds = cluster.domainGroups.flatMap(group => getTabIds(group));

    if (allTabIds.length > 0) {
      if (!result[name]) {
        result[name] = allTabIds as [number, ...number[]];
      } else {
        // If category name already exists, merge tab IDs
        result[name].push(...allTabIds);
      }
    }
  }

  console.log(`\n=== Clustering Pipeline Complete ===`);
  console.log(`Created ${Object.keys(result).length} categories, ${outlierTabs.length} outlier tabs`);
  console.log('Categories:', Object.keys(result));

  return result;
}
