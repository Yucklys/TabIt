// ==================== Chrome AI API Core Functions ====================
// Based on https://developer.chrome.com/docs/ai/prompt-api
// Pure functions only - No UI

interface DownloadProgressEvent extends Event {
  loaded: number;
  total: number;
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
  }
})();

// Export empty component (required by React)
export default function App() {
  return null;
}