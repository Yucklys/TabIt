import { categorizeAndGroup } from './categorizeAndGroup';
import { createGroupFromIndicesWithTabs, getAllTabGroups } from './tabGroups';

/**
 * Smart grouping: Only group tabs if their category matches existing groups
 * Does not modify or delete existing groups
 * E.g., User creates [Sports, News, Entertainment] groups
 * AI will only create groups that match these categories
 */
export async function smartGrouping(): Promise<void> {
  try {
    // Get existing tab groups
    const existingGroups = await getAllTabGroups();
    const existingGroupNames = existingGroups.map(g => g.title.toLowerCase());
    
    console.log('Existing groups:', existingGroupNames);
    
    // Get all tabs and categorize
    const allTabs = await chrome.tabs.query({});
    const categorizedResult = await categorizeAndGroup();
    
    // Only create groups that match existing group names
    const groupPromises = Object.entries(categorizedResult).map(async ([categoryName, tabIndices]) => {
      if (tabIndices && tabIndices.length > 0) {
        // Check if category matches existing group
        const categoryLower = categoryName.toLowerCase();
        const matchesExisting = existingGroupNames.some(existing => 
          existing.includes(categoryLower) || categoryLower.includes(existing)
        );
        
        if (matchesExisting || existingGroupNames.length === 0) {
          // Only create if it matches or no existing groups
          return await createGroupFromIndicesWithTabs(tabIndices, categoryName, allTabs);
        }
        
        console.log(`Skipping group "${categoryName}" - does not match existing groups`);
        return null;
      }
      return null;
    });
    
    const results = await Promise.all(groupPromises);
    const createdGroupsCount = results.filter(r => r !== null).length;
    
    console.log(`Created ${createdGroupsCount} tab groups (smart mode)`);
  } catch (error) {
    console.error('Error in smart grouping:', error);
    throw error;
  }
}
