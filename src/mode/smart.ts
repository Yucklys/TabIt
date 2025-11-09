import { getUngroupedTabs } from '@/api/tabs';
import { categorizeAndGroup } from '../api/categorizeAndGroup';
import { getAllTabGroups } from '../api/tabGroups';

/**
 * Smart grouping: Categorize tabs and save result to session storage
 * Only group tabs if their category matches existing groups
 * Does not modify or delete existing groups
 */
export async function smartGrouping(): Promise<void> {
  try {
    const tabs = await getUngroupedTabs();
    const existingGroups = await getAllTabGroups();
    const existingGroupNames = existingGroups.map(g => g.title ?? "").filter(name => name);
    
    console.log('Existing groups:', existingGroupNames);
    
    // Check if there are any tabs to process
    if (!tabs || tabs.length === 0) {
      await chrome.storage.session.set({ 
        categorizedResult: {},
        categorizationStatus: 'no-tabs',
        message: 'No ungrouped tabs found to categorize'
      });
      console.log('No ungrouped tabs found for smart mode');
      return;
    }
    
    // Check if there are existing groups
    // If yes and there are ungrouped tabs, pass existing group names to AI
    if (existingGroups.length > 0) {
      console.log('Smart mode: Found existing groups, will reuse their names');
      // Pass existing group names to AI so it can reuse them
      const categorizedResult = await categorizeAndGroup(tabs, existingGroupNames);
      
      await chrome.storage.session.set({ 
        categorizedResult: categorizedResult,
        categorizationStatus: 'completed'
      });
    } else {
      console.log('Smart mode: No existing groups, will categorize normally');
      // No existing groups, categorize normally
      const categorizedResult = await categorizeAndGroup(tabs);
      
      await chrome.storage.session.set({ 
        categorizedResult: categorizedResult,
        categorizationStatus: 'completed'
      });
    }
    
    console.log(`Smart mode categorization completed`);
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error in smart grouping:', err);
      await chrome.storage.session.set({ 
        categorizationStatus: 'error',
        categorizationError: err.message
      });
    } else {
      console.error('Unknown error encountered:', err);
      throw err;
    }
  }
}
