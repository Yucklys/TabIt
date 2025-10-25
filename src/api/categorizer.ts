import { checkExistingCategories } from './ai.ts';
import { type TabInfo } from './tabs.ts';

export interface CategorizedTab extends TabInfo {
  category: string;
  explanation: string;
  confidence: number;
}

export interface CategoryResult {
  category: string;
  tabs: CategorizedTab[];
  isNew: boolean;
}

/**
 * Categorize a single tab using AI
 */
export async function categorizeSingleTab(tab: TabInfo): Promise<CategorizedTab> {
  try {
    const result = await checkExistingCategories(tab.title, tab.url, '');
    
    return {
      ...tab,
      category: result.category,
      explanation: result.explanation,
      confidence: result.confidence
    };
  } catch (error) {
    console.error(`Error categorizing tab ${tab.title}:`, error);
    throw error;
  }
}