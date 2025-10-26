/**
 * Main API entry point
 * 
 * GROUPING FUNCTIONS:
 * - oneTimeGrouping: Simple one-time grouping
 * - smartGrouping: Only create groups matching existing categories
 * - aggressiveGrouping: Regroup all tabs
 * 
 * CUSTOM PROMPT:
 * - setCustomPrompt(text): Add custom AI instructions
 * 
 * BATCH & PROMISE PROCESSING:
 * Location: categorizeAndGroup.ts (lines 32-45)
 * - Batch tabs into groups of 10
 * - Process all batches in parallel with Promise.all
 * - Example: 15 tabs = 2 batches (10 + 5), processed simultaneously
 */

export { oneTimeGrouping } from './oneTime';
export { smartGrouping } from './smart';
export { aggressiveGrouping } from './aggressive';
export { setCustomPrompt, getCustomPrompt, clearCustomPrompt } from './prompts';
export type { GroupingMode } from './prompts';
