/**
 * Chrome Storage utilities for user settings
 */
import { type GroupingMode } from '../type/groupingMode';

export type Language = 'en' | 'ja' | 'es';

export interface UserSettings {
  customPrompt?: string;
  customGroups?: string[];
  selectedMode?: GroupingMode;
  tabRange?: [number, number];
  similarityThreshold?: number;
  autoGroupingEnabled?: boolean;
  groupCategories?: { [category: string]: number[] };
  language?: Language;
}

export async function saveUserSettings(settings: Partial<UserSettings>): Promise<void> {
  await chrome.storage.local.set(settings);
}

export async function getUserSettings(): Promise<UserSettings> {
  const result = await chrome.storage.local.get(['customPrompt', 'customGroups', 'selectedMode', 'tabRange', 'similarityThreshold']);
  return {
    customPrompt: result.customPrompt || '',
    customGroups: result.customGroups || [],
    selectedMode: result.selectedMode || 'smart',
    tabRange: result.tabRange || [1, 6],
    similarityThreshold: result.similarityThreshold ?? 0.7
  };
}

export async function getTabRange(): Promise<[number, number]> {
  const result = await chrome.storage.local.get('tabRange');
  return result.tabRange || [1, 6];
}

export async function setTabRange(range: [number, number]): Promise<void> {
  await chrome.storage.local.set({ tabRange: range });
}

export async function getCustomPrompt(): Promise<string> {
  const result = await chrome.storage.local.get('customPrompt');
  return result.customPrompt || '';
}

export async function setCustomPrompt(prompt: string): Promise<void> {
  await chrome.storage.local.set({ customPrompt: prompt });
}

export async function getCustomGroups(): Promise<string[]> {
  const result = await chrome.storage.local.get('customGroups');
  return result.customGroups || [];
}

export async function setCustomGroups(groups: string[]): Promise<void> {
  await chrome.storage.local.set({ customGroups: groups });
}

export async function getSelectedMode(): Promise<GroupingMode> {
  const result = await chrome.storage.local.get('selectedMode');
  return result.selectedMode || 'smart';
}

export async function setSelectedMode(mode: GroupingMode): Promise<void> {
  await chrome.storage.local.set({ selectedMode: mode });
}

export async function getSimilarityThreshold(): Promise<number> {
  const result = await chrome.storage.local.get('similarityThreshold');
  return result.similarityThreshold ?? 0.7;
}

export async function setSimilarityThreshold(threshold: number): Promise<void> {
  await chrome.storage.local.set({ similarityThreshold: threshold });
}

export async function getAutoGroupingEnabled(): Promise<boolean> {
  const result = await chrome.storage.local.get('autoGroupingEnabled');
  return result.autoGroupingEnabled === true;
}

export async function setAutoGroupingEnabled(enabled: boolean): Promise<void> {
  await chrome.storage.local.set({ autoGroupingEnabled: enabled });
}

export async function getGroupCategories(): Promise<{ [category: string]: number[] } | null> {
  const result = await chrome.storage.local.get('groupCategories');
  return result.groupCategories || null;
}

export async function setGroupCategories(categories: { [category: string]: number[] }): Promise<void> {
  await chrome.storage.local.set({ groupCategories: categories });
}

export async function getLanguage(): Promise<Language> {
  const result = await chrome.storage.local.get('language');
  return result.language || 'en';
}

export async function setLanguage(language: Language): Promise<void> {
  await chrome.storage.local.set({ language });
}
