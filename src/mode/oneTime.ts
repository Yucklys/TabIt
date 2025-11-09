import { categorizeAndGroup } from '@/api/categorizeAndGroup';
import { getUngroupedTabs } from '@/api/tabs';

/**
 * One-time grouping: Categorize tabs and save result to session storage
 * This is a one-time operation - future tabs won't be auto-grouped
 */
export async function oneTimeGrouping(): Promise<void> {
  try {
    const tabs = await getUngroupedTabs();
    
    // Check if there are any tabs to process
    if (!tabs || tabs.length === 0) {
      await chrome.storage.session.set({ 
        categorizedResult: {},
        categorizationStatus: 'no-tabs',
        message: 'No ungrouped tabs found to categorize'
      });
      console.log('No ungrouped tabs found for one-time mode');
      return;
    }

    const categorizedResult = await categorizeAndGroup(tabs);

    // Save result to session storage for UI to pick up
    await chrome.storage.session.set({ 
      categorizedResult: categorizedResult,
      categorizationStatus: 'completed'
    });

    console.log(`One-time mode categorization completed`);
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error in one-time grouping:', err);
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
