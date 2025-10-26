// Global category store for merging similar categories
const globalCategories: { [key: string]: { confidence: number, count: number } } = {};

/**
 * Merge similar categories based on confidence threshold
 */
export function mergeSimilarCategories(category: string, confidence: number): string {
  const threshold = 0.7;
  
  // If confidence is low, create a new category
  if (confidence < threshold) {
    return category;
  }
  
  // Check if this category is similar to existing ones
  for (const [existingCategory, data] of Object.entries(globalCategories)) {
    if (isSimilarCategory(category, existingCategory)) {
      // Choose the shorter, more general category name
      const finalCategory = chooseBetterCategoryName(category, existingCategory);
      
      // Update the existing category
      globalCategories[finalCategory] = { 
        confidence: Math.max(data.confidence, confidence), 
        count: data.count + 1 
      };
      
      // Remove the old category if we're using a different name
      if (finalCategory !== existingCategory) {
        delete globalCategories[existingCategory];
      }
      
      return finalCategory;
    }
  }
  
  // Create new category
  globalCategories[category] = { confidence, count: 1 };
  return category;
}

/**
 * Choose the better category name between two similar categories
 */
function chooseBetterCategoryName(cat1: string, cat2: string): string {
  // Prefer shorter names (more general)
  if (cat1.length < cat2.length) {
    return cat1;
  } else if (cat2.length < cat1.length) {
    return cat2;
  }
  
  // If same length, prefer the one that appears first alphabetically
  return cat1 < cat2 ? cat1 : cat2;
}

/**
 * Check if two categories are similar
 */
function isSimilarCategory(cat1: string, cat2: string): boolean {
  const cat1Lower = cat1.toLowerCase();
  const cat2Lower = cat2.toLowerCase();
  
  // Check for exact matches
  if (cat1Lower === cat2Lower) {
    return true;
  }
  
  // Special cases: merge duplicate broad categories
  const broadCategories = ['entertainment', 'development', 'productivity', 'communication'];
  if (broadCategories.includes(cat1Lower) && broadCategories.includes(cat2Lower)) {
    return true;
  }
  
  // Check for partial word matches (e.g., "self-assessment" vs "self-discovery")
  const words1 = cat1Lower.split(/[\s\-&]+/);
  const words2 = cat2Lower.split(/[\s\-&]+/);
  
  for (const word1 of words1) {
    for (const word2 of words2) {
      if (word1.length > 3 && word2.length > 3 && 
          (word1.includes(word2) || word2.includes(word1))) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Clear global categories for new run
 */
export function clearGlobalCategories(): void {
  Object.keys(globalCategories).forEach(key => delete globalCategories[key]);
}
