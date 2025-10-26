// Export all categorization strategies
export { categorizeAllTabsBatch, categorizeAllTabsHybrid, categorizeAllTabsParallel } from './strategies';
export { categorizeSingleTab, type CategorizedTab, type CategoryResult } from './categorizer';

// Export AI functions
export { categorizeTab, categorizeTabsBatch, checkExistingCategories, getCategories, clearCategories } from './ai';

// Export tab utilities
export { getUngroupedTabs, getTabInfoList, type TabInfo } from './tabs';

// Smart categorization method with fixed batch count
import { categorizeAllTabsHybrid } from './strategies';
import { getUngroupedTabs, getTabInfoList } from './tabs';

/**
 * Categorize all tabs using 5 batches
 */
export async function categorizeAllTabsSmart(): Promise<void> {
  try {
    const tabs = await getUngroupedTabs();
    const tabInfoList = getTabInfoList(tabs);
    
    console.log(`Found ${tabs.length} tabs, ${tabInfoList.length} valid tabs`);
    
    // Use 5 batches
    await categorizeAllTabsHybrid();
    
  } catch (error) {
    console.error('Error in categorization:', error);
    throw error;
  }
}
