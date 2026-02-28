import { getUngroupedTabs } from '$api/tabs';
import { categorizeAndGroup } from '$api/categorizeAndGroup';
import { getAllTabGroups } from '$api/tabGroups';

/**
 * Smart grouping: Categorize tabs and save result to session storage
 * Only group tabs if their category matches existing groups
 * Does not modify or delete existing groups
 */
export async function smartGrouping(): Promise<void> {
  try {
    // Get all tabs (not just ungrouped ones) - matching aggressive behavior
    const allTabs = await chrome.tabs.query({});

    // Filter out chrome:// and chrome-extension:// tabs
    const tabs = allTabs.filter(tab =>
      tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://')
    );

    console.log('Smart mode (now Aggressive): Processing all tabs');

    // Check if there are any tabs to process
    if (!tabs || tabs.length === 0) {
      await chrome.storage.session.set({
        categorizedResult: {},
        categorizationStatus: 'no-tabs',
        message: 'No valid tabs found to categorize'
      });
      console.log('No valid tabs found for smart mode');
      return;
    }

    // Run categorization on ALL tabs, not passing existingGroupNames 
    // to allow AI full control (Aggressive logic)
    const categorizedResult = await categorizeAndGroup(tabs);

    await chrome.storage.session.set({
      categorizedResult: categorizedResult,
      categorizationStatus: 'completed'
    });

    console.log(`Smart mode categorization completed (as aggressive full regroup)`);
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
