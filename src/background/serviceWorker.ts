/**
 * Background Service Worker for TabIt Extension
 * Handles automatic tab categorization when auto-grouping is enabled
 * Uses the same AI clustering pipeline as the popup UI
 */

import { categorizeAndGroup } from '$api/categorizeAndGroup';
import { createTabGroupFromIds, getAllTabGroups } from '$api/tabGroups';
import { getUngroupedTabs } from '$api/tabs';

// Helper to check if auto-grouping is enabled
async function isAutoGroupingEnabled(): Promise<boolean> {
  const result = await chrome.storage.local.get('autoGroupingEnabled');
  return result.autoGroupingEnabled === true;
}

// Filter out chrome:// and chrome-extension:// tabs
function filterValidTabs(tabs: chrome.tabs.Tab[]): chrome.tabs.Tab[] {
  return tabs.filter((tab) => {
    if (!tab.url) return false;
    try {
      const url = new URL(tab.url);
      return (
        url.protocol !== 'chrome:' &&
        url.protocol !== 'chrome-extension:' &&
        url.protocol !== 'edge:' &&
        url.protocol !== 'about:'
      );
    } catch {
      return false;
    }
  });
}

// AI-powered auto-grouping for ungrouped tabs
async function runAutoGrouping(): Promise<void> {
  console.log('[Auto-Grouping] Starting AI-powered grouping for ungrouped tabs...');

  const ungroupedTabs = await getUngroupedTabs();
  const validTabs = filterValidTabs(ungroupedTabs);

  if (validTabs.length === 0) {
    console.log('[Auto-Grouping] No ungrouped tabs to process');
    return;
  }

  console.log(`[Auto-Grouping] Processing ${validTabs.length} ungrouped tabs`);

  // Get existing group names so AI can reuse them
  const existingGroups = await getAllTabGroups();
  const existingGroupNames = existingGroups.map((g) => g.title || '').filter(Boolean);

  // Run AI clustering pipeline
  const categorized = await categorizeAndGroup(validTabs, existingGroupNames.length > 0 ? existingGroupNames : undefined);

  if (!categorized || Object.keys(categorized).length === 0) {
    console.log('[Auto-Grouping] No categories returned from AI pipeline');
    return;
  }

  // Build a map of existing group titles → groupId for merging
  const existingGroupMap = new Map<string, number>();
  for (const group of existingGroups) {
    if (group.title) {
      existingGroupMap.set(group.title.toLowerCase(), group.id);
    }
  }

  // Create or merge into tab groups
  for (const [categoryName, tabIds] of Object.entries(categorized)) {
    const existingGroupId = existingGroupMap.get(categoryName.toLowerCase());

    try {
      if (existingGroupId !== undefined) {
        // Add tabs to existing group with same title
        await chrome.tabs.group({ groupId: existingGroupId, tabIds });
        console.log(`[Auto-Grouping] Added ${tabIds.length} tabs to existing group "${categoryName}"`);
      } else {
        // Create new group
        await createTabGroupFromIds(tabIds as [number, ...number[]], categoryName);
        console.log(`[Auto-Grouping] Created new group "${categoryName}" with ${tabIds.length} tabs`);
      }
    } catch (error) {
      console.error(`[Auto-Grouping] Error grouping "${categoryName}":`, error);
    }
  }

  console.log('[Auto-Grouping] AI-powered grouping complete');
}

// Debounce timer for auto-grouping
let autoGroupingTimer: ReturnType<typeof setTimeout> | null = null;

// Schedule auto-grouping with debounce
function scheduleAutoGrouping(): void {
  if (autoGroupingTimer) {
    clearTimeout(autoGroupingTimer);
  }

  autoGroupingTimer = setTimeout(() => {
    runAutoGrouping().catch((error) => {
      console.error('[Auto-Grouping] Error:', error);
    });
  }, 3000); // Wait 3 seconds after last tab change
}

// Handle new tab creation
async function handleTabCreated(tab: chrome.tabs.Tab): Promise<void> {
  if (!(await isAutoGroupingEnabled())) {
    return;
  }

  // Skip if tab is already grouped
  if (tab.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE) {
    return;
  }

  scheduleAutoGrouping();
}

// Handle tab updates (URL changes, navigation, etc.)
async function handleTabUpdated(
  changeInfo: { url?: string; status?: string },
  tab: chrome.tabs.Tab
): Promise<void> {
  // Only process when URL changes or when status becomes complete
  if (!changeInfo.url && changeInfo.status !== 'complete') {
    return;
  }

  if (!(await isAutoGroupingEnabled())) {
    return;
  }

  // Skip if tab is already grouped
  if (tab.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE) {
    return;
  }

  scheduleAutoGrouping();
}

// Listen for tab events
chrome.tabs.onCreated.addListener((tab) => {
  handleTabCreated(tab).catch((error) => {
    console.error('[Auto-Grouping] Error handling tab created:', error);
  });
});

chrome.tabs.onUpdated.addListener((_tabId, changeInfo, tab) => {
  handleTabUpdated(changeInfo, tab).catch((error) => {
    console.error('[Auto-Grouping] Error handling tab updated:', error);
  });
});

// Listen for storage changes to enable/disable auto-grouping
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.autoGroupingEnabled) {
    const enabled = changes.autoGroupingEnabled.newValue;
    console.log(`[Auto-Grouping] ${enabled ? 'Enabled' : 'Disabled'}`);
  }
});

console.log('[TabIt] Service worker loaded');
