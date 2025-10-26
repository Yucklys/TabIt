import { categorizeAndGroup } from '@/api/categorizeAndGroup';
import { createTabGroupsFromCategories } from '@/api/tabGroups';

/**
 * One-time grouping: Categorize tabs and create tab groups automatically
 * This is a one-time operation - future tabs won't be auto-grouped
 */
export async function oneTimeGrouping(): Promise<void> {
  try {
    const categorizedResult = await categorizeAndGroup();

    const tabGroups = await createTabGroupsFromCategories(categorizedResult);

    console.log(`Created ${tabGroups.length} tab groups`);
  } catch (error) {
    console.error('Error in one-time grouping:', error);
    throw error;
  }
}
