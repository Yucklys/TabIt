import type { TabProps } from '@/type/tabProps';
import { groupTabsByDomain, getTabIds } from './domainGrouper';
import { buildSimilarityScorer, buildDomainGroupMatrix } from './tfidfSimilarity';
import { hierarchicalClustering } from './hierarchicalClustering';
import type { Cluster } from './hierarchicalClustering';

import { filterClustersBySize } from './clusterFilter';
import { nameClusters } from './categoryNamer';
import { getCustomGroups } from '../storage';

import { getLanguage } from '../storage';
import { matchDomainsToCustomCategories } from './categoryNamer';

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
  const allDomainGroups = groupTabsByDomain(tabs);
  console.log(`\n[Phase 1] Domain grouping: ${allDomainGroups.length} domain groups`);

  // Phase 1.5: Pre-categorize domains based on custom groups
  console.log(`\n[Phase 1.5] Pre-categorizing domains using custom groups...`);
  const customGroups = await getCustomGroups();
  const lang = await getLanguage();

  let unmappedDomainGroups = allDomainGroups;
  const preCategorizedResult: { [category: string]: number[] } = {};

  if (customGroups.length > 0) {
    const domainToCategory = await matchDomainsToCustomCategories(allDomainGroups, customGroups, lang);

    if (domainToCategory.size > 0) {
      unmappedDomainGroups = [];

      for (const group of allDomainGroups) {
        const matchedCategory = domainToCategory.get(group.domain);
        if (matchedCategory) {
          if (!preCategorizedResult[matchedCategory]) {
            preCategorizedResult[matchedCategory] = [];
          }
          preCategorizedResult[matchedCategory].push(...getTabIds(group));
          console.log(`Pre-categorized domain ${group.domain} -> ${matchedCategory}`);
        } else {
          unmappedDomainGroups.push(group);
        }
      }
    }
  }

  const result: { [category: string]: [number, ...number[]] } = {};

  // If there are unmapped domains, proceed with the rest of the pipeline
  if (unmappedDomainGroups.length > 0) {
    // Phase 2: Build similarity matrix (TF-IDF + domain bonus)
    console.log(`\n[Phase 2] Building similarity matrix (TF-IDF) for ${unmappedDomainGroups.length} unmapped domains...`);
    const unmappedTabs = unmappedDomainGroups.flatMap(g => g.tabs);
    const scorer = buildSimilarityScorer(unmappedTabs);
    const similarityMatrix = buildDomainGroupMatrix(unmappedTabs, unmappedDomainGroups, scorer);

    // Phase 3: HAC clustering
    console.log(`\n[Phase 3] Running hierarchical clustering...`);
    const clusters = hierarchicalClustering(unmappedDomainGroups, similarityMatrix, similarityThreshold, tabRange[1]);

    // Phase 4: Filter by minimum size
    console.log(`\n[Phase 4] Filtering clusters by minimum size...`);
    const { validClusters, outlierTabs } = filterClustersBySize(
      clusters,
      tabRange[0]
    );

    // Phase 5: Name clusters
    console.log(`\n[Phase 5] Naming clusters...`);
    const clusterNames = await nameClusters(validClusters, customGroups, tabRange[1]);

    // Phase 6: Convert to expected format
    console.log(`\n[Phase 6] Converting to output format...`);

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
    console.log(`Created ${Object.keys(result).length} categories, ${outlierTabs.length} outlier tabs from unmapped domains`);
  } else {
    console.log(`\nAll domains pre-categorized. Skipping general clustering.`);
  }

  // Phase 7: Merge pre-categorized results
  for (const [category, ids] of Object.entries(preCategorizedResult)) {
    if (ids.length > 0) {
      if (!result[category]) {
        result[category] = ids as [number, ...number[]];
      } else {
        result[category] = [...new Set([...result[category], ...ids])] as [number, ...number[]];
      }
    }
  }

  console.log(`\n=== Clustering Pipeline Complete ===`);
  console.log('Categories:', Object.keys(result));

  return result;
}