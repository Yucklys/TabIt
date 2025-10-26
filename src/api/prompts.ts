import { setCustomPrompt, getCustomPrompt, clearCustomPrompt } from './ai';

/**
 * Custom prompt management functions
 * These allow users to add their own instructions to the AI
 */
export {
  setCustomPrompt,
  getCustomPrompt,
  clearCustomPrompt
};

/**
 * Grouping modes type definition
 */
export type GroupingMode = 'one-time' | 'smart' | 'aggressive';
