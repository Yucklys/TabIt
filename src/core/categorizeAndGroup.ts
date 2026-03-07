import { getTabProps, getTitleById } from '$services/tabs';
import { clusterAndGroup as runClustering } from './clustering/clusteringPipeline';
import { getSimilarityThreshold, getTabRange } from '$services/storage';

type Tab = chrome.tabs.Tab;

/**
 * Core clustering logic - categorizes tabs using TF-IDF + HAC
 * Returns categorized tabs with their IDs
 */
export async function categorizeTabs(
  tabs: Tab[],
): Promise<{ [category: string]: [number, ...number[]] }> {
  const tabInfoList = getTabProps(tabs);
  console.log('Total tab number:', tabInfoList.length);

  const tabRange = await getTabRange();
  const similarityThreshold = await getSimilarityThreshold();

  const categorizedResult = await runClustering(tabInfoList, tabRange, similarityThreshold);

  console.log('Clustering result:', categorizedResult);

  const categorizedTitles: { [category: string]: string[] } = {};
  for (const [category, ids] of Object.entries(categorizedResult)) {
    categorizedTitles[category] = await getTitleById(ids);
  }
  console.log('Categorized Titles:', categorizedTitles);

  return categorizedResult;
}

/**
 * Main entry point - groups all valid tabs and saves result to session storage
 */
export async function groupTabs(): Promise<void> {
  try {
    const allTabs = await chrome.tabs.query({});
    const validTabs = allTabs.filter(
      (tab) => tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://'),
    );

    if (!validTabs || validTabs.length === 0) {
      await chrome.storage.session.set({
        categorizedResult: {},
        categorizationStatus: 'no-tabs',
        message: 'No valid tabs found to categorize',
      });
      console.log('No valid tabs found');
      return;
    }

    const categorizedResult = await categorizeTabs(validTabs);

    await chrome.storage.session.set({
      categorizedResult: categorizedResult,
      categorizationStatus: 'completed',
    });

    console.log(`Grouping completed: ${Object.keys(categorizedResult).length} groups created`);
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error in grouping:', err);
      await chrome.storage.session.set({
        categorizationStatus: 'error',
        categorizationError: err.message,
      });
    } else {
      console.error('Unknown error encountered:', err);
      throw err;
    }
  }
}
