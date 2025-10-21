// ==================== Chrome AI API Core Functions ====================
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
    ai?: {
      languageModel?: {
        availability(): Promise<'readily' | 'after-download' | 'no'>;
        create(options?: { signal?: AbortSignal }): Promise<LanguageModel>;
        params(): Promise<{
          defaultTemperature: number;
          maxTemperature: number;
          defaultTopK: number;
          maxTopK: number;
        }>;
      };
    };
    Summarizer?: {
      availability(): Promise<'readily' | 'after-download' | 'no'>;
      create(options?: SummarizerOptions): Promise<AISummarizer>;
    };
  }
}

// ==================== Core API Functions ====================

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
    sharedContext?: string;
    outputLanguage?: 'en' ;
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
    sharedContext = 'This is a scientific article',
    outputLanguage = 'en'
  } = options;

  const summarizer = await window.Summarizer.create({
    sharedContext,
    type,
    format,
    length,
    outputLanguage,
    monitor(m) {
      m.addEventListener('downloadprogress', (e) => {
        console.log(`Model download: ${Math.round(e.loaded * 100)}%`);
      });
    }
  });

  const result = await summarizer.summarize(text, {
    context: 'This article is intended for a tech-savvy audience.'
  });

  summarizer.destroy();
  return result;
}

/**
 * Prompt API - Send natural language requests to Gemini Nano
 * Usage: const result = await prompt("your question here");
 */
export async function prompt(input: string): Promise<string> {
  if (!window.ai?.languageModel) {
    throw new Error('Prompt API not available');
  }

  const availability = await window.ai.languageModel.availability();
  if (availability === 'no') {
    throw new Error('Prompt API is unavailable');
  }

  const session = await window.ai.languageModel.create();
  const result = await session.prompt(input);
  session.destroy();
  
  return result;
}

// ==================== Test Functions ====================

/**
 * Test Summarizer API with hardcoded input
 */
export async function testSummarize(): Promise<void> {
  console.log('=== Testing Summarizer API ===');
  
  try {
    const testText = "I don't know how to code";
    console.log('Input:', testText);
    
    const result = await summarize(testText);
    console.log('Result:', result);
    
  } catch (error) {
    console.error('Summarizer test failed:', error);
  }
}

/**
 * Test Prompt API with hardcoded input
 */
export async function testPrompt(): Promise<void> {
  console.log('=== Testing Prompt API ===');
  
  try {
    const testInput = 'Write a haiku about AI';
    console.log('Input:', testInput);
    
    const result = await prompt(testInput);
    console.log('Result:', result);
    
  } catch (error) {
    console.error('Prompt test failed:', error);
  }
}

// ==================== Direct Function Calls ====================

// Run tests immediately when loaded
(async () => {
  console.log('Starting AI API tests...');
  
  // Test 1: Summarizer API
  await testSummarize();
  
  // Test 2: Prompt API  
  await testPrompt();
  
  console.log('All tests completed!');
})();

// Export empty component (required by React)
export default function App() {
  return null;
}