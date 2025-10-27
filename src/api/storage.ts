/**
 * Chrome Storage utilities for user settings
 */

export interface UserSettings {
  customPrompt?: string;
  customGroups?: string[];
  selectedMode?: 'one-time' | 'smart' | 'aggressive';
}

export async function saveUserSettings(settings: Partial<UserSettings>): Promise<void> {
  await chrome.storage.local.set(settings);
}

export async function getUserSettings(): Promise<UserSettings> {
  const result = await chrome.storage.local.get(['customPrompt', 'customGroups', 'selectedMode']);
  return {
    customPrompt: result.customPrompt || '',
    customGroups: result.customGroups || [],
    selectedMode: result.selectedMode || 'smart'
  };
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

export async function getSelectedMode(): Promise<'one-time' | 'smart' | 'aggressive'> {
  const result = await chrome.storage.local.get('selectedMode');
  return result.selectedMode || 'smart';
}

export async function setSelectedMode(mode: 'one-time' | 'smart' | 'aggressive'): Promise<void> {
  await chrome.storage.local.set({ selectedMode: mode });
}