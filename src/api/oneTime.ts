import { categorizeAndGroup } from './categorizeAndGroup';
import { createGroupFromIndicesWithTabs } from './tabGroups';

/**
 * One-time grouping: Categorize tabs and create tab groups automatically
 * This is a one-time operation - future tabs won't be auto-grouped
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
