import { getTabProps, getTitleById } from './tabs';
import { clusterAndGroup as runClustering } from './clustering/clusteringPipeline';
import { getSimilarityThreshold, getTabRange } from './storage';

type Tab = chrome.tabs.Tab;

/**
 * Core categorization logic shared by all grouping modes
 * Returns categorized tabs with their IDs
 */
export async function categorizeAndGroup(
  tabs: Tab[],
): Promise<{ [category: string]: [number, ...number[]] }> {
  const tabInfoList = getTabProps(tabs);
  console.log('Total tab number:', tabInfoList.length)

  // Get clustering settings
  const tabRange = await getTabRange();
  const similarityThreshold = await getSimilarityThreshold();

  // Run clustering pipeline
  const categorizedResult = await runClustering(tabInfoList, tabRange, similarityThreshold);

  console.log('Clustering result:', categorizedResult);

  const categorizedTitles: { [category: string]: string[] } = {};
  for (const [category, ids] of Object.entries(categorizedResult)) {
    categorizedTitles[category] = await getTitleById(ids);
  }
  console.log('Categorized Titles:', categorizedTitles);

  return categorizedResult;
}
