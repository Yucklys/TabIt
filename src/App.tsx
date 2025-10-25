<<<<<<< Updated upstream
// ==================== Chrome AI API Core Functions ====================
// Based on https://developer.chrome.com/docs/ai/prompt-api
// Pure functions only - No UI

interface DownloadProgressEvent extends Event {
  loaded: number;
  total: number;
=======
import { useEffect } from 'react'
import { categorizeAllTabsSmart } from './api';

export default function App() {
  useEffect(() => {
    // Automatically run categorization when the extension loads
    const runCategorization = async () => {
      try {
        await categorizeAllTabsSmart(); // 智能选择最佳策略
      } catch (error) {
        console.error('Error in TabSense extension:', error);
      }
    };

    runCategorization();
  }, []);

  // Return empty component - all output goes to console
  return null;
>>>>>>> Stashed changes
}

interface AICreateMonitor {
  addEventListener(type: 'downloadprogress', listener: (event: DownloadProgressEvent) => void): void;
}

interface SummarizerOptions {
  sharedContext?: string;
  type?: 'key-points' | 'tldr' | 'teaser' | 'headline';
  format?: 'markdown' | 'plain-text';
  length?: 'short' | 'medium' | 'long';
  outputLanguage?: 'en' | 'es' | 'ja';
  signal?: AbortSignal;
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

// ==================== Summarizer API ====================

/**
 * Summarizer API - Generate summaries using Gemini Nano
 * Usage: const result = await summarize("your text here");
 */
export async function summarize(
  text: string, 
  options: {
    type?: 'key-points' | 'tldr' | 'teaser' | 'headline';
    length?: 'short' | 'medium' | 'long';
    format?: 'markdown' | 'plain-text';
    outputLanguage?: 'en' | 'es' | 'ja';
  } = {}
): Promise<string> {
  if (!window.Summarizer) {
    throw new Error('Summarizer API not available');
  }

  const availability = await window.Summarizer.availability();
  if (availability === 'no') {
    throw new Error('Summarizer API is unavailable');
  }

  const {
    type = 'key-points',
    length = 'medium',
    format = 'markdown',
    outputLanguage = 'en'
  } = options;

  const summarizer = await window.Summarizer.create({
    type,
    format,
    length,
    outputLanguage
  });

  const result = await summarizer.summarize(text, {
    context: 'Soving the problems that is the programmer should do'
  });

  summarizer.destroy();
  return result;
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

// ==================== Tab Categorization ====================

// Global categories storage
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

/**
 * Test smart tab categorization with existing category checking
 */
export async function testSmartCategorization(): Promise<void> {
  const sampleTabs = [
    {
      title: "NBA Live Stream - Lakers vs Warriors",
      url: "https://espn.com/nba/live",
      content: "Watch live NBA basketball game between Los Angeles Lakers and Golden State Warriors. Real-time scores, highlights, and commentary."
    },
    {
      title: "React Documentation - Hooks",
      url: "https://reactjs.org/docs/hooks-intro.html",
      content: "React Hooks let you use state and other React features without writing a class. Learn about useState, useEffect, and custom hooks."
    },
    {
      title: "Python Tutorial - Data Structures",
      url: "https://docs.python.org/tutorial/datastructures.html",
      content: "This chapter describes some things you've learned about already in more detail, and adds some new things as well. Lists, tuples, dictionaries, and sets."
    },
    {
      title: "Gmail - Inbox",
      url: "https://mail.google.com",
      content: "Gmail is email that's intuitive, efficient, and useful. 15 GB of storage, less spam, and mobile access. Sign in to access your Gmail account."
    },
    {
      title: "GitHub - Trending Repositories",
      url: "https://github.com/trending",
      content: "See what the GitHub community is most excited about today. Trending repositories, developers, and topics on GitHub."
    },
    {
      title: "Vue.js Documentation",
      url: "https://vuejs.org/guide/",
      content: "Vue.js is a progressive JavaScript framework for building user interfaces. Learn about components, directives, and reactive data binding."
    },
    {
      title: "ESPN Football Scores",
      url: "https://espn.com/nfl/scores",
      content: "Latest NFL football scores, standings, and news. Track your favorite teams and players throughout the season."
    }
  ];

  console.log('=== Testing Smart Tab Categorization ===');
  console.log('This will check if new tabs belong to existing categories or create new ones.\n');
  
  // Clear existing categories
  clearCategories();
  
  for (const tab of sampleTabs) {
    try {
      console.log(`\nProcessing: ${tab.title}`);
      console.log(`URL: ${tab.url}`);
      
      const result = await checkExistingCategories(tab.title, tab.url, tab.content);
      
      if (result.isNew) {
        console.log(`✅ Created NEW category: ${result.category}`);
      } else {
        console.log(`✅ Added to EXISTING category: ${result.category}`);
      }
      
      // Show current categories
      const currentCategories = getCategories();
      console.log(`Current categories: ${Object.keys(currentCategories).join(', ')}`);
      
    } catch (error) {
      console.error(`Failed to process ${tab.title}:`, error);
    }
  }
  
  // Final summary
  console.log('\n=== Final Category Summary ===');
  const finalCategories = getCategories();
  for (const [categoryName, tabs] of Object.entries(finalCategories)) {
    console.log(`\n${categoryName} (${tabs.length} tabs):`);
    tabs.forEach(tab => console.log(`  - ${tab.title}`));
  }
}

/**
 * Test tab categorization with sample data (original function)
 */
export async function testTabCategorization(): Promise<void> {
  const sampleTabs = [
    {
      title: "NBA Live Stream - Lakers vs Warriors",
      url: "https://espn.com/nba/live",
      content: "Watch live NBA basketball game between Los Angeles Lakers and Golden State Warriors. Real-time scores, highlights, and commentary."
    },
    {
      title: "React Documentation - Hooks",
      url: "https://reactjs.org/docs/hooks-intro.html",
      content: "React Hooks let you use state and other React features without writing a class. Learn about useState, useEffect, and custom hooks."
    }
  ];

  console.log('=== Testing Basic Tab Categorization ===');
  
  for (const tab of sampleTabs) {
    try {
      console.log(`\nCategorizing: ${tab.title}`);
      console.log(`URL: ${tab.url}`);
      const result = await categorizeTab(tab.title, tab.url, tab.content);
      console.log('Result:', result);
    } 
    catch (error) {
      console.error(`Failed to categorize ${tab.title}:`, error);
    }
  }
}

// ==================== Test Functions ====================

/**
 * Test Summarizer API with hardcoded input
 */
export async function testSummarize(): Promise<void> {
  try {
    const testText = 'Solving the problems that is the programmer should do.';
    console.log('Summarizer Input:', testText);
    const result = await summarize(testText);
    console.log('Summarizer Result:', result);
  } catch (error) {
    console.error('Summarizer test failed:', error);
  }
}

/**
 * Test Prompt API with hardcoded input
 */
export async function testPrompt(): Promise<void> {
  try {
    const testInput = 'Write a haiku about AI';
    console.log('Prompt Input:', testInput);
    const result = await prompt(testInput);
    console.log('Prompt Result:', result);
  } catch (error) {
    console.error('Prompt test failed:', error);
  }
}

// ==================== Direct Function Calls ====================

// Run tests immediately when loaded
(async () => {
  // Test Summarizer API
  if (window.Summarizer) {
    await testSummarize();
  }
  
  // Test Prompt API
  if (window.LanguageModel) {
    await testPrompt();
    
    // Test Smart Tab Categorization
    await testSmartCategorization();
  }
})();

// Export empty component (required by React)
export default function App() {
  return null;
}