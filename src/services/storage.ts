/**
 * Chrome Storage utilities for user settings
 */

export type Language = 'en' | 'ja' | 'es';

export interface UserSettings {
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
  const result = await chrome.storage.local.get(['tabRange', 'similarityThreshold', 'autoGroupingEnabled', 'groupCategories']);
  return {
    tabRange: (Array.isArray(result.tabRange) && result.tabRange.length === 2) ? result.tabRange as [number, number] : [1, 6],
    similarityThreshold: typeof result.similarityThreshold === 'number' ? result.similarityThreshold : 0.5,
    autoGroupingEnabled: typeof result.autoGroupingEnabled === 'boolean' ? result.autoGroupingEnabled : false,
    groupCategories: (result.groupCategories && typeof result.groupCategories === 'object' && !Array.isArray(result.groupCategories)) ? result.groupCategories as { [category: string]: number[] } : undefined
  };
}

export async function getTabRange(): Promise<[number, number]> {
  const result = await chrome.storage.local.get('tabRange');
  return (Array.isArray(result.tabRange) && result.tabRange.length === 2) ? result.tabRange as [number, number] : [1, 6];
}

export async function setTabRange(range: [number, number]): Promise<void> {
  await chrome.storage.local.set({ tabRange: range });
}

export async function getSimilarityThreshold(): Promise<number> {
  const result = await chrome.storage.local.get('similarityThreshold');
  return typeof result.similarityThreshold === 'number' ? result.similarityThreshold : 0.5;
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
  if (result.groupCategories && typeof result.groupCategories === 'object' && !Array.isArray(result.groupCategories)) {
    return result.groupCategories as { [category: string]: number[] };
  }
  return null;
}

export async function setGroupCategories(categories: { [category: string]: number[] }): Promise<void> {
  await chrome.storage.local.set({ groupCategories: categories });
}

export async function getLanguage(): Promise<Language> {
  const result = await chrome.storage.local.get('language');
  return (result.language as Language) || 'en';
}

export async function setLanguage(language: Language): Promise<void> {
  await chrome.storage.local.set({ language });
}
