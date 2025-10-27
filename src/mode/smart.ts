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
    const existingGroupNames = existingGroups.map(g => g.title ?? "");
    
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
    
    const categorizedResult = await categorizeAndGroup(tabs);

    // Save result to session storage for UI to pick up
    await chrome.storage.session.set({ 
      categorizedResult: categorizedResult,
      categorizationStatus: 'completed'
    });
    
    console.log(`Smart mode categorization completed`);
  } catch (error) {
    console.error('Error in smart grouping:', error);
    await chrome.storage.session.set({ 
      categorizationStatus: 'error',
      categorizationError: error.message
    });
    throw error;
  }
}
