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
  console.log('Total tab number:', validTabInfoList.length)

  const categorizedTabs = await categorizeTabsBatch(validTabInfoList, existingGroups);
  
  console.log('Raw AI categorized response:', categorizedTabs);
  
  const categorizedResult: { [category: string]: [number, ...number[]] } = {};
  for (const group of categorizedTabs) {
    if (!categorizedResult[group.CategoryName]) {
      categorizedResult[group.CategoryName] = group.indices;
      console.log(`Created new category "${group.CategoryName}" with indices:`, group.indices);
    } else {
      categorizedResult[group.CategoryName].push(...group.indices);
      console.log(`Merged into existing category "${group.CategoryName}". New indices:`, categorizedResult[group.CategoryName]);
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
