import { categorizeAndGroup } from '@/api/categorizeAndGroup';
import { createTabGroupsFromCategories } from '@/api/tabGroups';
import { getUngroupedTabs } from '@/api/tabs';

/**
 * One-time grouping: Categorize tabs and create tab groups automatically
 * This is a one-time operation - future tabs won't be auto-grouped
 */
export async function oneTimeGrouping(): Promise<void> {
  try {
    const tabs = await getUngroupedTabs();
    const categorizedResult = await categorizeAndGroup(tabs);

    const tabGroups = await createTabGroupsFromCategories(categorizedResult);

    console.log(`Created ${tabGroups.length} tab groups`);
  } catch (error) {
    console.error('Error in one-time grouping:', error);
    throw error;
  }
}
