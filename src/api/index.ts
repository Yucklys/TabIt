// Import required functions
import { categorizeTabsBatch, clearCategories } from './ai';
import { createGroupFromIndicesWithTabs } from './tabGroups';
import { mergeSimilarCategories, clearGlobalCategories } from './merger';
import { getTabInfoList } from './tabs';

/**
 * One-time grouping: Categorize tabs and create tab groups automatically
 */
export async function oneTimeGrouping(): Promise<void> {
  try {
    // Get all tabs once
    const allTabs = await chrome.tabs.query({});
    
    const categorizedResult = await categorizeAndGroup();
    
    // Create all groups in parallel for speed
    const groupPromises = Object.entries(categorizedResult).map(async ([categoryName, tabIndices]) => {
      if (tabIndices && tabIndices.length > 0) {
        return await createGroupFromIndicesWithTabs(tabIndices, categoryName, allTabs);
      }
      return null;
    });
    
    const results = await Promise.all(groupPromises);
    const createdGroupsCount = results.filter(r => r !== null).length;

    console.log(`Created ${createdGroupsCount} tab groups`);
    
  } catch (error) {
    console.error('Error in one-time grouping:', error);
    throw error;
  }
}

async function categorizeAndGroup() {
  const startTime = Date.now();
  
  const tabs = await chrome.tabs.query({});
  const allTabInfoList = getTabInfoList(tabs);
  
  // Filter out invalid tabs (chrome://, chrome-extension://)
  const validTabInfoList = allTabInfoList.filter(tab =>
    tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://')
  );
  
  clearCategories();
  clearGlobalCategories();

  // Display ALL tabs (including invalid) for reference
  allTabInfoList.forEach((tab) => {
    const isValid = tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://');
    if (isValid) {
      console.log(`Tab ${tab.index}:`, `{index: ${tab.index}, url: "${tab.url}", title: "${tab.title}"}`);
    } else {
      console.log(`Tab ${tab.index}: INVALID (filtered)`);
    }
  });

  // Process all tabs in ONE batch for better context awareness
  const batchResult = await categorizeTabsBatch(validTabInfoList);
  
  // Process results - map local indices to global tab indices
  const categorizedResult: { [category: string]: number[] } = {};
  for (const [localIndexStr, data] of Object.entries(batchResult)) {
    const localIndex = parseInt(localIndexStr);
    const tab = validTabInfoList[localIndex];
    if (tab) {
      const globalIndex = tab.index;
      const finalCategory = mergeSimilarCategories(data.category, data.confidence);

      if (!categorizedResult[finalCategory]) {
        categorizedResult[finalCategory] = [];
      }
      categorizedResult[finalCategory].push(globalIndex);
    }
  }
  
  console.log('Final Result:');
  console.log(categorizedResult);
  
  const endTime = Date.now();
  const runTime = (endTime - startTime) / 1000;
  console.log(`Completed in ${runTime.toFixed(2)}s`);
  
  return categorizedResult;
}
