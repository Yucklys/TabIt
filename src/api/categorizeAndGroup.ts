import { categorizeTabsBatch } from './ai';
import { getTabProps, getTitleById } from './tabs';

type Tab = chrome.tabs.Tab;

/**
 * Core categorization logic shared by all grouping modes
 * Returns categorized tabs with their IDs
 */
export async function categorizeAndGroup(
  tabs: Tab[],
  existingGroups: string[] = []
): Promise<{ [category: string]: [number, ...number[]] }> {
  const tabInfoList = getTabProps(tabs);
  console.log('Total tab number:', tabInfoList.length)

  const categorizedTabs = await categorizeTabsBatch(tabInfoList, existingGroups);

  console.log('Raw AI categorized response:', categorizedTabs);

  const categorizedResult: { [category: string]: [number, ...number[]] } = {};
  for (const group of categorizedTabs) {
    if (!categorizedResult[group.CategoryName]) {
      categorizedResult[group.CategoryName] = group.ids;
    } else {
      categorizedResult[group.CategoryName].push(...group.ids);
    }
  }

  const categorizedTitles: { [category: string]: string[] } = {};
  for (const [category, ids] of Object.entries(categorizedResult)) {
    categorizedTitles[category] = await getTitleById(ids);
  }
  console.log('Categorized Titles:', categorizedTitles);

  return categorizedResult;
}
