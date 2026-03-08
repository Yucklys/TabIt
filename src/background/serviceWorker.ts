/**
 * Background Service Worker for TabIt Extension
 * Handles automatic tab categorization when auto-grouping is enabled
 * Uses the same AI clustering pipeline as the popup UI
 */

import { categorizeNewTabs } from '$core/categorizeAndGroup';
import { createTabGroupFromIds, getAllTabGroups } from '$services/tabGroups';
import { getUngroupedTabs } from '$services/tabs';
import { extractDomain } from '$utils/url';

// Helper to check if auto-grouping is enabled
async function isAutoGroupingEnabled(): Promise<boolean> {
  const result = await chrome.storage.local.get('autoGroupingEnabled');
  return result.autoGroupingEnabled === true;
}

// AI-powered auto-grouping for ungrouped tabs using incremental Leiden clustering
async function runAutoGrouping(): Promise<void> {
  console.log('[Auto-Grouping] Starting incremental clustering for ungrouped tabs...');

  const ungroupedTabs = await getUngroupedTabs();

  if (ungroupedTabs.length === 0) {
    console.log('[Auto-Grouping] No ungrouped tabs to process');
    return;
  }

  console.log(`[Auto-Grouping] Processing ${ungroupedTabs.length} ungrouped tabs`);

  // Gather existing groups WITH their member tabs
  const existingGroups = await getAllTabGroups();
  const existingGroupInfo = await Promise.all(
    existingGroups.map(async (group) => ({
      groupId: group.id,
      name: group.title || '',
      tabs: await chrome.tabs.query({ groupId: group.id }),
    }))
  );

  // Run incremental clustering
  const result = await categorizeNewTabs(ungroupedTabs, existingGroupInfo);

  // Merge into existing groups by groupId (reliable, not name matching)
  for (const { groupId, tabIds } of result.merged) {
    try {
      await chrome.tabs.group({ groupId, tabIds });
      console.log(`[Auto-Grouping] Merged ${tabIds.length} tabs into group ${groupId}`);
    } catch (error) {
      console.error(`[Auto-Grouping] Error merging into group ${groupId}:`, error);
    }
  }

  // Create new groups
  for (const [name, tabIds] of Object.entries(result.created)) {
    try {
      await createTabGroupFromIds(tabIds as [number, ...number[]], name);
      console.log(`[Auto-Grouping] Created new group "${name}" with ${tabIds.length} tabs`);
    } catch (error) {
      console.error(`[Auto-Grouping] Error creating group "${name}":`, error);
    }
  }

  console.log('[Auto-Grouping] Incremental clustering complete');
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
  if (!changeInfo.url && changeInfo.status !== 'complete') {
    return;
  }

  if (!(await isAutoGroupingEnabled())) {
    return;
  }

  if (tab.groupId === chrome.tabGroups.TAB_GROUP_ID_NONE) {
    // Ungrouped tab — schedule clustering
    scheduleAutoGrouping();
    return;
  }

  // Grouped tab — only act on URL changes
  if (!changeInfo.url) return;

  // Domain coherence check: does the new domain match any sibling in the group?
  const newDomain = extractDomain(tab.url || '');
  const groupTabs = await chrome.tabs.query({ groupId: tab.groupId });
  const hasDomainMatch = groupTabs.some(
    (t) => t.id !== tab.id && extractDomain(t.url || '') === newDomain
  );

  if (!hasDomainMatch) {
    await chrome.tabs.ungroup(tab.id!);
    scheduleAutoGrouping();
  }
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
