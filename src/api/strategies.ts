import { checkExistingCategories, clearCategories, categorizeTabsBatch } from './ai.ts';
import { getUngroupedTabs, getTabInfoList } from './tabs.ts';

/**
 * BATCH method - Single AI call for all tabs
 */
export async function categorizeAllTabsBatch(): Promise<void> {
  try {
    const tabs = await getUngroupedTabs();
    const tabInfoList = getTabInfoList(tabs);
    
    console.log(`Found ${tabs.length} tabs, ${tabInfoList.length} valid tabs`);
    clearCategories();
    
    // Batch categorize all tabs with single AI call
    const batchResult = await categorizeTabsBatch(tabInfoList);
    
    // Process results and store in categories
    for (const [indexStr] of Object.entries(batchResult)) {
      const index = parseInt(indexStr);
      const tab = tabInfoList.find(t => t.index === index);
      if (tab) {
        await checkExistingCategories(tab.title, tab.url, '');
      }
    }
    
    // Display tabs for reference
    tabInfoList.forEach(tab => {
      console.log(`Tab ${tab.index}:`, `{index: ${tab.index}, url: "${tab.url}", title: "${tab.title}"}`);
    });
    
    // Generate JSON format result directly from batchResult
    const result: { [category: string]: number[] } = {};
    for (const [indexStr, data] of Object.entries(batchResult)) {
      const localIndex = parseInt(indexStr);
      const tab = tabInfoList[localIndex];
      if (tab) {
        const globalIndex = tab.index; // Get the actual global index
        if (!result[data.category]) {
          result[data.category] = [];
        }
        result[data.category].push(globalIndex);
      }
    }
    
    console.log('\nFinal Result:');
    console.log(result);
    
  } catch (error) {
    console.error('Error categorizing tabs:', error);
    throw error;
  }
}

/**
 * HYBRID method - Fixed batch count with parallel processing
 */
export async function categorizeAllTabsHybrid(batchCount: number = 5): Promise<void> {
  try {
    const startTime = Date.now();
    const tabs = await getUngroupedTabs();
    const tabInfoList = getTabInfoList(tabs);
    
    console.log(`Found ${tabs.length} tabs, ${tabInfoList.length} valid tabs`);
    clearCategories();
    
    // Display tabs for reference
    tabInfoList.forEach(tab => {
      console.log(`Tab ${tab.index}:`, `{index: ${tab.index}, url: "${tab.url}", title: "${tab.title}"}`);
    });
    
    // Split tabs into fixed number of batches
    const batchSize = Math.ceil(tabInfoList.length / batchCount);
    const batches: Array<Array<{index: number, title: string, url: string}>> = [];
    
    for (let i = 0; i < tabInfoList.length; i += batchSize) {
      batches.push(tabInfoList.slice(i, i + batchSize));
    }
    
    console.log(`Running categorization with ${batches.length} batches...`);
    
    // Process each batch in parallel using Promise.all
    const batchPromises = batches.map(async (batch, batchIndex) => {
      try {
        const batchResult = await categorizeTabsBatch(batch);
        
        // Process results for this batch - map local indices to global indices
        const batchResultFormatted: { [category: string]: number[] } = {};
        for (const [localIndexStr, data] of Object.entries(batchResult)) {
          const localIndex = parseInt(localIndexStr);
          const tab = batch[localIndex];
          if (tab) {
            const globalIndex = tab.index; // Get the actual global index
            if (!batchResultFormatted[data.category]) {
              batchResultFormatted[data.category] = [];
            }
            batchResultFormatted[data.category].push(globalIndex);
          }
        }
        
        return batchResultFormatted;
      } catch (error) {
        console.error(`Error processing batch ${batchIndex + 1}:`, error);
        return {};
      }
    });
    
    // Wait for all batches to complete
    const batchResults = await Promise.all(batchPromises);
    
    // Merge all batch results
    const finalResult: { [category: string]: number[] } = {};
    for (const batchResult of batchResults) {
      for (const [category, indices] of Object.entries(batchResult)) {
        if (!finalResult[category]) {
          finalResult[category] = [];
        }
        finalResult[category].push(...indices);
      }
    }
    
    console.log('\nFinal Result:');
    console.log(finalResult);
    
    const endTime = Date.now();
    const runTime = (endTime - startTime) / 1000;
    console.log(`\nCompleted in ${runTime.toFixed(2)}s`);
    
  } catch (error) {
    console.error('Error categorizing tabs:', error);
    throw error;
  }
}

/**
 * PARALLEL method - Promise.all for all tabs
 */
export async function categorizeAllTabsParallel(): Promise<void> {
  try {
    const tabs = await getUngroupedTabs();
    const tabInfoList = getTabInfoList(tabs);
    
    console.log(`Found ${tabs.length} tabs, ${tabInfoList.length} valid tabs`);
    clearCategories();
    
    // Display tabs for reference
    tabInfoList.forEach(tab => {
      console.log(`Tab ${tab.index}:`, `{index: ${tab.index}, url: "${tab.url}", title: "${tab.title}"}`);
    });
    
    // Process all tabs in parallel using Promise.all
    const promises = tabInfoList.map(async (tab) => {
      try {
        const result = await checkExistingCategories(tab.title, tab.url, '');
        return { index: tab.index, category: result.category };
      } catch (error) {
        console.error(`Failed to categorize ${tab.title}:`, error);
        return { index: tab.index, category: 'General' };
      }
    });
    
    const results = await Promise.all(promises);
    
    // Generate JSON format result from results
    const result: { [category: string]: number[] } = {};
    for (const { index, category } of results) {
      if (!result[category]) {
        result[category] = [];
      }
      result[category].push(index);
    }
    
    console.log('\nFinal Result:');
    console.log(result);
    
  } catch (error) {
    console.error('Error categorizing tabs:', error);
    throw error;
  }
}
