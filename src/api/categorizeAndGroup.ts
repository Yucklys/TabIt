import { categorizeTabsBatch } from './ai';
import { getTabInfoList, getTitleByIndex } from './tabs';

type Tab = chrome.tabs.Tab;

/**
 * Core categorization logic shared by all grouping modes
 * Returns categorized tabs with their indices
 */
export async function categorizeAndGroup(
  tabs: Tab[], 
  existingGroups: string[] = []
): Promise<{ [category: string]: [number, ...number[]] }> {
  const startTime = Date.now();
  
  const allTabInfoList = getTabInfoList(tabs);
  
  // Filter out invalid tabs (chrome://, chrome-extension://)
  const validTabInfoList = allTabInfoList.filter(tab =>
    tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://')
  );

  allTabInfoList.forEach((tab) => {
    const isValid = tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://');
    if (isValid) {
      console.log(`Tab ${tab.index}:`, `{index: ${tab.index}, url: "${tab.url}", title: "${tab.title}"}`);
    } else {
      console.log(`Tab ${tab.index}: INVALID (filtered)`);
    }
  });

  const categorizedTabs = await categorizeTabsBatch(validTabInfoList, existingGroups);
  
  const categorizedResult: { [category: string]: [number, ...number[]] } = {};
  for (const group of categorizedTabs) {
    if (!categorizedResult[group.CategoryName]) {
      categorizedResult[group.CategoryName] = group.indices;
    } else {
      categorizedResult[group.CategoryName].push(...group.indices);
    }
  }
  
  console.log('Final Result:');
  const categorizedTitles: { [category: string]: string[] } = {};
  for (const [category, indices] of Object.entries(categorizedResult)) {
    categorizedTitles[category] = await getTitleByIndex(indices);
  }
  console.log('Categorized Titles:', categorizedTitles);
  
  const endTime = Date.now();
  const runTime = (endTime - startTime) / 1000;
  console.log(`Completed in ${runTime.toFixed(2)}s`);
  
  return categorizedResult;
}
