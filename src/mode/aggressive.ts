import { categorizeAndGroup } from '../api/categorizeAndGroup';

/**
 * Aggressive grouping: Categorize all tabs and save result to session storage
 * Let AI have full control, may regroup existing tabs
 * AI will create the best possible grouping structure
 */
export async function aggressiveGrouping(): Promise<void> {
  try {
    // Get all tabs (not just ungrouped ones)
    const allTabs = await chrome.tabs.query({});
    
    // Filter out chrome:// and chrome-extension:// tabs
    const validTabs = allTabs.filter(tab => 
      tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://')
    );
    
    // Check if there are any valid tabs to process
    if (!validTabs || validTabs.length === 0) {
      await chrome.storage.session.set({ 
        categorizedResult: {},
        categorizationStatus: 'no-tabs',
        message: 'No valid tabs found to categorize'
      });
      console.log('No valid tabs found for aggressive mode');
      return;
    }
    
    const categorizedResult = await categorizeAndGroup(validTabs);

    // Save result to session storage for UI to pick up
    await chrome.storage.session.set({ 
      categorizedResult: categorizedResult,
      categorizationStatus: 'completed'
    });
    
    console.log(`Aggressive mode categorization completed`);
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error in aggressive grouping:', err);
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
