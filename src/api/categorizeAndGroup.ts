import { getTabProps, getTitleById } from './tabs';
import { clusterAndGroup as runClustering } from './clustering/clusteringPipeline';
import { getSimilarityThreshold, getTabRange, getCustomGroups, setCustomGroups } from './storage';

type Tab = chrome.tabs.Tab;

/**
 * Core categorization logic shared by all grouping modes
 * Returns categorized tabs with their IDs
 * @param tabs - Chrome tabs to categorize
 * @param existingGroupNames - Optional existing group names to reuse (e.g. from smart mode)
 */
export async function categorizeAndGroup(
  tabs: Tab[],
  existingGroupNames?: string[],
): Promise<{ [category: string]: [number, ...number[]] }> {
  const tabInfoList = getTabProps(tabs);
  console.log('Total tab number:', tabInfoList.length)

  // If existing group names are provided, merge them with custom groups
  // so the clustering pipeline can reuse existing category names
  if (existingGroupNames && existingGroupNames.length > 0) {
    const currentCustomGroups = await getCustomGroups();
    const merged = [...new Set([...existingGroupNames, ...currentCustomGroups])];
    await setCustomGroups(merged);
  }

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
