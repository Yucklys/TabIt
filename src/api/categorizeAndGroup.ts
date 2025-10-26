import { categorizeTabsBatch } from './ai';
import { mergeSimilarCategories, clearGlobalCategories } from './merger';
import { getTabInfoList } from './tabs';

/**
 * Core categorization logic shared by all grouping modes
 * Returns categorized tabs with their indices
 */
export async function categorizeAndGroup(): Promise<{ [category: string]: number[] }> {
  const startTime = Date.now();
  
  const tabs = await chrome.tabs.query({});
  const allTabInfoList = getTabInfoList(tabs);
  
  // Filter out invalid tabs (chrome://, chrome-extension://)
  const validTabInfoList = allTabInfoList.filter(tab =>
    tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://')
  );
  
  clearGlobalCategories();

  // Display ALL tabs (including invalid) for reference
  allTabInfoList.forEach((tab) => {
    const isValid = tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://');
    if (isValid) {
      console.log(`Tab ${tab.index}:`, `{index: ${tab.index}, url: "${tab.url}", title: "${tab.title}"}`);
    } else {
      console.log(`Tab ${tab.index}: INVALID (filtered)`);
    }
  });

  // Split tabs into smaller batches for faster processing
  const batchSize = 10;
  const batches: Array<Array<{index: number, title: string, url: string}>> = [];
  
  for (let i = 0; i < validTabInfoList.length; i += batchSize) {
    batches.push(validTabInfoList.slice(i, i + batchSize));
  }
  
  // Process all batches in parallel using Promise.all
  const batchPromises = batches.map(async (batch) => {
    return await categorizeTabsBatch(batch);
  });
  
  const batchResults = await Promise.all(batchPromises);
  
  // Merge all batch results
  const batchResult: { [index: number]: {category: string, confidence: number} } = {};
  let globalIndex = 0;
  batchResults.forEach((result) => {
    for (const [, data] of Object.entries(result)) {
      batchResult[globalIndex] = data;
      globalIndex++;
    }
  });
  
  // Process results - map local indices to global tab indices
  const categorizedResult: { [category: string]: number[] } = {};
  for (const [localIndexStr, data] of Object.entries(batchResult)) {
    const localIndex = parseInt(localIndexStr);
    const tab = validTabInfoList[localIndex];
    if (tab) {
      const globalIndex = tab.index;
      const finalCategory = mergeSimilarCategories(data.category, data.confidence);

      if (!categorizedResult[finalCategory]) {
        categorizedResult[finalCategory] = [];
      }
      categorizedResult[finalCategory].push(globalIndex);
    }
  }
  
  console.log('Final Result:');
  console.log(categorizedResult);
  
  const endTime = Date.now();
  const runTime = (endTime - startTime) / 1000;
  console.log(`Completed in ${runTime.toFixed(2)}s`);
  
  return categorizedResult;
}
