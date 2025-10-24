interface DownloadProgressEvent extends Event {
  loaded: number;
  total: number;
}

interface AICreateMonitor {
  addEventListener(type: 'downloadprogress', listener: (event: DownloadProgressEvent) => void): void;
}

interface SummarizerOptions {
  monitor?: (monitor: AICreateMonitor) => void;
}

interface AISummarizer {
  summarize(text: string, options?: { context?: string; signal?: AbortSignal }): Promise<string>;
  summarizeStreaming(text: string, options?: { context?: string; signal?: AbortSignal }): ReadableStream<string>;
  destroy(): void;
}

interface LanguageModel {
  prompt(input: string, options?: { signal?: AbortSignal; responseConstraint?: unknown }): Promise<string>;
  promptStreaming(input: string, options?: { signal?: AbortSignal; responseConstraint?: unknown }): ReadableStream<string>;
  destroy(): void;
  clone(): Promise<LanguageModel>;
  append(input: string): Promise<void>;
  inputUsage: number;
  inputQuota: number;
}

declare global {
  interface Window {
    LanguageModel?: {
      availability(): Promise<'readily' | 'after-download' | 'no'>;
      create(options?: { signal?: AbortSignal }): Promise<LanguageModel>;
      params(): Promise<{
        defaultTemperature: number;
        maxTemperature: number;
        defaultTopK: number;
        maxTopK: number;
      }>;
    };
    Summarizer?: {
      availability(): Promise<'readily' | 'after-download' | 'no'>;
      create(options?: SummarizerOptions): Promise<AISummarizer>;
    };
  }
}

// ==================== Prompt API ====================

/**
 * Prompt API - Send natural language requests to Gemini Nano
 * Usage: const result = await prompt("your question here");
 */
export async function prompt(input: string): Promise<string> {
  if (!window.LanguageModel) {
    throw new Error('Prompt API not available - window.LanguageModel not found');
  }

  const availability = await window.LanguageModel.availability();
  if (availability === 'no') {
    throw new Error('Prompt API is unavailable');
  }
  
  if (availability === 'after-download') {
    throw new Error('Prompt API needs user gesture to download model');
  }

  const session = await window.LanguageModel.create();
  const result = await session.prompt(input);
  session.destroy();
  
  return result;
}

/**
 * Prompt API with streaming
 * Usage: const result = await promptStreaming("your question here");
 * This could let 
 */
export async function promptStreaming(input: string): Promise<string> {
  if (!window.LanguageModel) {
    throw new Error('Prompt API not available - window.LanguageModel not found');
  }

  const availability = await window.LanguageModel.availability();
  if (availability === 'no') {
    throw new Error('Prompt API is unavailable');
  }
  
  if (availability === 'after-download') {
    throw new Error('Prompt API needs user gesture to download model');
  }

  const session = await window.LanguageModel.create();
  const stream = session.promptStreaming(input);
  
  let fullResult = '';
  const reader = stream.getReader();
  
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      fullResult = value;
    }
  } finally {
    reader.releaseLock();
  }
  
  session.destroy();
  return fullResult;
}

let categories: { [key: string]: Array<{title: string, url: string, content: string}> } = {};

/**
 * Categorize a web page using Prompt API
 * Usage: const category = await categorizeTab(title, url, content);
 */
// eslint-disable-next-line react-refresh/only-export-components
export async function categorizeTab(title: string, url: string, content: string): Promise<string> {
  const promptText = `tab manager and  job is to generate a category for the given web page. The result should be a single word describe what does this web page about. For example, an NBA live stream page will be categorize as 'Sports'. Your generation should follow this pattern: CATEGORY: <Page Category>, EXPLAINATION: <Why you think this is the correct category>, CONFIDENCE: <How confident are you about your answer, where 1 means totally confident and 0 means totally not confident>

Page Title: ${title}
Page URL: ${url}
Page Content: ${content.substring(0, 1000)}...`;

  return await prompt(promptText);
}

/**
 * Check if a new tab belongs to existing categories
 * Usage: const result = await checkExistingCategories(title, url, content);
 */
// eslint-disable-next-line react-refresh/only-export-components
export async function checkExistingCategories(title: string, url: string, content: string): Promise<{category: string, isNew: boolean}> {
  const existingCategories = Object.keys(categories);
  
  if (existingCategories.length === 0) {
    // No existing categories, create new one
    const newCategory = await categorizeTab(title, url, content);
    const categoryName = extractCategoryName(newCategory);
    categories[categoryName] = [{title, url, content}];
    return {category: categoryName, isNew: true};
  }

  // Check against existing categories
  const categoryCheckPrompt = `You are a browser tab manager. I have existing categories: ${existingCategories.join(', ')}. 

For the given web page, determine if it belongs to any of these existing categories. If yes, return the most appropriate existing category name. If no, return "NEW_CATEGORY" and suggest a new category name.

Page Title: ${title}
Page URL: ${url}
Page Content: ${content.substring(0, 500)}...

Respond in format: EXISTING_CATEGORY: <category_name_or_NEW_CATEGORY>, SUGGESTED_CATEGORY: <new_category_if_needed>`;

  const result = await prompt(categoryCheckPrompt);
  const existingCategory = extractExistingCategory(result);
  
  if (existingCategory === "NEW_CATEGORY") {
    // Create new category
    const suggestedCategory = extractSuggestedCategory(result);
    categories[suggestedCategory] = [{title, url, content}];
    return {category: suggestedCategory, isNew: true};
  } else {
    // Find the exact matching category key (case-insensitive)
    const matchingKey = existingCategories.find(key => 
      key.toLowerCase() === existingCategory.toLowerCase()
    );
    
    if (matchingKey) {
      // Add to existing category
      if (!categories[matchingKey]) {
        categories[matchingKey] = [];
      }
      categories[matchingKey].push({title, url, content});
      return {category: matchingKey, isNew: false};
    } else {
      // Category not found, create new one
      categories[existingCategory] = [{title, url, content}];
      return {category: existingCategory, isNew: true};
    }
  }
}

/**
 * Extract category name from AI response
 */
function extractCategoryName(response: string): string {
  const match = response.match(/CATEGORY:\s*([^,]+)/i);
  return match ? match[1].trim() : 'Uncategorized';
}

/**
 * Extract existing category from AI response
 */
function extractExistingCategory(response: string): string {
  const match = response.match(/EXISTING_CATEGORY:\s*([^,]+)/i);
  return match ? match[1].trim() : 'NEW_CATEGORY';
}

/**
 * Extract suggested category from AI response
 */
function extractSuggestedCategory(response: string): string {
  const match = response.match(/SUGGESTED_CATEGORY:\s*([^,]+)/i);
  return match ? match[1].trim() : 'Uncategorized';
}

/**
 * Get all categories and their tabs
 */
export function getCategories(): { [key: string]: Array<{title: string, url: string, content: string}> } {
  return categories;
}

/**
 * Clear all categories
 */
export function clearCategories(): void {
  categories = {};
}
