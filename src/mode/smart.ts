import { categorizeAndGroup } from '../api/categorizeAndGroup';
import { createTabGroupsFromCategories, getAllTabGroups } from '../api/tabGroups';

/**
 * Smart grouping: Only group tabs if their category matches existing groups
 * Does not modify or delete existing groups
 * E.g., User creates [Sports, News, Entertainment] groups
 * AI will only create groups that match these categories
 */
export async function smartGrouping(): Promise<void> {
  try {
    const existingGroups = await getAllTabGroups();
    const existingGroupNames = existingGroups.map(g => g.title ?? "");
    
    console.log('Existing groups:', existingGroupNames);
    
    const categorizedResult = await categorizeAndGroup();

    const tabGroups = await createTabGroupsFromCategories(categorizedResult);
    
    console.log(`Created ${tabGroups.length} tab groups (smart mode)`);
  } catch (error) {
    console.error('Error in smart grouping:', error);
    throw error;
  }
}
