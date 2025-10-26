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

let categories: { [key: string]: Array<{title: string, url: string, content: string, explanation: string, confidence: number}> } = {};

/**
 * Categorize a web page using Prompt API
 * Usage: const category = await categorizeTab(title, url, content);
 */
export async function categorizeTab(title: string, url: string): Promise<string> {
  const promptText = `You are a browser tab manager. Analyze the URL and title to create a meaningful category name. NEVER use "Uncategorized" or "Other".

Rules:
1. Create a category name that describes the tab's purpose
2. Be specific and descriptive
3. Use your judgment to determine the most appropriate category

Return format: CATEGORY: <category name>, CONFIDENCE: <0.0-1.0>

Page Title: ${title}
Page URL: ${url}`;

  return await prompt(promptText);
}

/**
 * Batch categorize multiple tabs at once
 */
export async function categorizeTabsBatch(tabs: Array<{index: number, title: string, url: string}>): Promise<{ [index: number]: {category: string, confidence: number} }> {
  const tabsInfo = tabs.map((tab, localIndex) => `${localIndex}: ${tab.title}`).join('\n');
  
  const promptText = `Categorize these tabs. Use categories: Development, Entertainment, AI Tools, Communication, Local Development, News, Shopping, Education, Business, Technology.

Return JSON with local index as key: {"0": {"category": "Development", "confidence": 0.9}}

Tabs:
${tabsInfo}`;

  const response = await prompt(promptText);
  
  try {
    // Try to extract JSON from the response
    let jsonStr = response.trim();
    
    // Remove markdown code blocks if present
    if (jsonStr.startsWith('```json')) {
      jsonStr = jsonStr.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    
    // Find JSON object in the response
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonStr = jsonMatch[0];
    }
    
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('Failed to parse AI response as JSON:', response);
    console.error('Parse error:', error);
    
    // Fallback: assign "General" to all tabs using local indices
    const fallback: { [index: number]: {category: string, confidence: number} } = {};
    tabs.forEach((_, localIndex) => fallback[localIndex] = {category: 'General', confidence: 0.5});
    return fallback;
  }
}

/**
 * Check if a new tab belongs to existing categories
 * Usage: const result = await checkExistingCategories(title, url, content);
 */
export async function checkExistingCategories(title: string, url: string, content: string): Promise<{category: string, explanation: string, confidence: number, isNew: boolean}> {
  // Get category and confidence from AI
  const aiResponse = await categorizeTab(title, url);
  const categoryName = extractCategoryName(aiResponse);
  const confidence = extractConfidence(aiResponse);
  
  // Add to categories
  if (!categories[categoryName]) {
    categories[categoryName] = [];
  }
  categories[categoryName].push({title, url, content, explanation: 'AI categorized', confidence});
  
  return {
    category: categoryName,
    explanation: 'AI categorized',
    confidence,
    isNew: categories[categoryName].length === 1
  };
}


/**
 * Extract category name from AI response
 */
function extractCategoryName(response: string): string {
  const match = response.match(/CATEGORY:\s*([^,]+)/i);
  const category = match ? match[1].trim() : '';
  
  // If no category found, analyze the response to create one
  if (!category || category.toLowerCase() === 'uncategorized' || category.toLowerCase() === 'other') {
    // Try to extract any meaningful word from the response
    const words = response.toLowerCase().match(/\b(development|entertainment|communication|local|news|shopping|education|business|sports|technology|programming|ai|tools|video|content|help|tutorial|guide)\b/);
    if (words) {
      return words[0].charAt(0).toUpperCase() + words[0].slice(1);
    }
    return 'Web Content';
  }
  
  return category;
}

/**
 * Extract explanation from AI response
 */
export function extractExplanation(response: string): string {
  const match = response.match(/EXPLANATION:\s*([^,]+)/i);
  return match ? match[1].trim() : 'Categorized based on page content and URL';
}

/**
 * Extract confidence from AI response
 */
export function extractConfidence(response: string): number {
  const match = response.match(/CONFIDENCE:\s*([0-9.]+)/i);
  const confidence = match ? parseFloat(match[1]) : 0.8;
  
  // Ensure confidence is between 0 and 1
  return Math.max(0, Math.min(1, confidence));
}


/**
 * Get all categories and their tabs
 */
export function getCategories(): { [key: string]: Array<{title: string, url: string, content: string, explanation: string, confidence: number}> } {
  return categories;
}

/**
 * Clear all categories
 */
export function clearCategories(): void {
  categories = {};
}
