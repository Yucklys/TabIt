import { categorizeTabsBatch } from './ai';
import { mergeSimilarCategories, clearGlobalCategories } from './merger';
import { getTabInfoList } from './tabs';

type Tab = chrome.tabs.Tab;

/**
 * Core categorization logic shared by all grouping modes
 * Returns categorized tabs with their indices
 */
export async function categorizeAndGroup(tabs: Tab[]): Promise<{ [category: string]: [number, ...number[]] }> {
  const startTime = Date.now();
  
  const allTabInfoList = getTabInfoList(tabs);
  
  // Filter out invalid tabs (chrome://, chrome-extension://)
  const validTabInfoList = allTabInfoList.filter(tab =>
    tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://')
  );
  
  clearGlobalCategories();

  allTabInfoList.forEach((tab) => {
    const isValid = tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://');
    if (isValid) {
      console.log(`Tab ${tab.index}:`, `{index: ${tab.index}, url: "${tab.url}", title: "${tab.title}"}`);
    } else {
      console.log(`Tab ${tab.index}: INVALID (filtered)`);
    }
  });

  const categorizedTabs = await categorizeTabsBatch(validTabInfoList);
  
  const categorizedResult: { [category: string]: [number, ...number[]] } = {};
  for (const [localIndexStr, data] of Object.entries(categorizedTabs)) {
    const localIndex = parseInt(localIndexStr);
    const tab = validTabInfoList[localIndex];
    if (tab) {
      const globalIndex = tab.index;
      const finalCategory = mergeSimilarCategories(data.category, data.confidence);

      if (!categorizedResult[finalCategory]) {
        categorizedResult[finalCategory] = [globalIndex];
      } else {
        categorizedResult[finalCategory].push(globalIndex);
      }
    }
  }
  
  console.log('Final Result:');
  console.log(categorizedResult);
  
  const endTime = Date.now();
  const runTime = (endTime - startTime) / 1000;
  console.log(`Completed in ${runTime.toFixed(2)}s`);
  
  return categorizedResult;
}
