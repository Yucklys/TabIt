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

// User custom prompt storage
let customPrompt: string = '';

export function setCustomPrompt(prompt: string): void {
  customPrompt = prompt;
  console.log('AI.ts: Custom prompt stored:', prompt || '(empty)');
}

export function getCustomPrompt(): string {
  return customPrompt;
}

export function clearCustomPrompt(): void {
  customPrompt = '';
}

/**
 * Batch categorize multiple tabs at once
 */
export async function categorizeTabsBatch(tabs: Array<{index: number, title: string, url: string}>): Promise<{ [index: number]: {category: string, confidence: number} }> {
  const tabsInfo = tabs.map((tab, localIndex) => `${localIndex}: ${tab.title} (${tab.url})`).join('\n');
  
  // Log custom prompt usage
  if (customPrompt) {
    console.log('Using custom prompt:', customPrompt);
  }
  
  
  const promptText = `${customPrompt ? `CRITICAL: Follow this instruction exactly: ${customPrompt}

` : ''}Analyze these browser tabs and group them.

Rules:
1. Group tabs from the SAME website together
2. Use category names as specified
3. Apply any custom grouping instructions provided

Return JSON format: {"0": {"category": "CategoryName", "confidence": 0.9}}

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



