/**
 * Background Service Worker for TabIt Extension
 * Handles automatic tab categorization when auto-grouping is enabled
 * Only triggers when a domain reaches the minimum tab range threshold
 */

import type { TabProps } from '../type/tabProps';
import { groupTabsByDomain, getTabIds } from '../api/clustering/domainGrouper';

// Helper to check if auto-grouping is enabled
async function isAutoGroupingEnabled(): Promise<boolean> {
  const result = await chrome.storage.local.get('autoGroupingEnabled');
  return result.autoGroupingEnabled === true;
}

// Get tab range settings
async function getTabRange(): Promise<[number, number]> {
  const result = await chrome.storage.local.get('tabRange');
  return result.tabRange || [1, 6];
}

// Get similarity threshold
async function getSimilarityThreshold(): Promise<number> {
  const result = await chrome.storage.local.get('similarityThreshold');
  return result.similarityThreshold ?? 0.7;
}

// Get custom groups
async function getCustomGroups(): Promise<string[]> {
  const result = await chrome.storage.local.get('customGroups');
  return result.customGroups || [];
}

// Get stored group categories
async function getStoredGroupMapping(): Promise<{ [category: string]: number[] } | null> {
  const result = await chrome.storage.local.get('groupCategories');
  return result.groupCategories || null;
}

// Update stored group categories
async function updateStoredGroupMapping(categories: { [category: string]: number[] }): Promise<void> {
  await chrome.storage.local.set({ groupCategories: categories });
}

// Helper to get tab properties
function getTabProps(tab: chrome.tabs.Tab): TabProps | null {
  if (!tab.url || !tab.id) return null;

  try {
    const url = new URL(tab.url);

    // Skip extension pages and special URLs
    if (url.protocol === 'chrome:' || url.protocol === 'chrome-extension:' ||
        url.protocol === 'edge:' || url.protocol === 'about:') {
      return null;
    }

    return {
      id: tab.id,
      title: tab.title || '',
      domain: url.hostname,
      path: url.pathname,
    };
  } catch (e) {
    console.error('Error parsing tab URL:', e);
    return null;
  }
}

// Get all ungrouped tabs as TabProps
async function getUngroupedTabProps(): Promise<TabProps[]> {
  const tabs = await chrome.tabs.query({
    groupId: chrome.tabGroups.TAB_GROUP_ID_NONE,
    currentWindow: true
  });

  const tabProps: TabProps[] = [];
  for (const tab of tabs) {
    const props = getTabProps(tab);
    if (props) tabProps.push(props);
  }

  return tabProps;
}

// Count tabs by domain for ungrouped tabs
async function countTabsByDomain(): Promise<Map<string, number>> {
  const tabProps = await getUngroupedTabProps();
  const domainCounts = new Map<string, number>();

  for (const tab of tabProps) {
    const count = domainCounts.get(tab.domain) || 0;
    domainCounts.set(tab.domain, count + 1);
  }

  return domainCounts;
}

// Domain-based grouping for ungrouped tabs only
// Groups ungrouped tabs with the same domain together, using domain name as group name
async function runAutoGrouping(): Promise<void> {
  console.log('[Auto-Grouping] Starting domain-based grouping for ungrouped tabs...');

  const tabProps = await getUngroupedTabProps();
  if (tabProps.length === 0) {
    console.log('[Auto-Grouping] No ungrouped tabs to process');
    return;
  }

  const [minTabRange] = await getTabRange();

  console.log(`[Auto-Grouping] Processing ${tabProps.length} ungrouped tabs`);

  // Group ungrouped tabs by domain
  const domainGroups = groupTabsByDomain(tabProps);
  console.log(`[Auto-Grouping] Found ${domainGroups.length} domain groups`);

  // For each domain group, create a new group with domain name
  for (const domainGroup of domainGroups) {
    if (domainGroup.tabs.length < minTabRange) {
      console.log(`[Auto-Grouping] Domain ${domainGroup.domain} has only ${domainGroup.tabs.length} ungrouped tabs (min: ${minTabRange}), skipping`);
      continue;
    }

    const domainName = domainGroup.domain;
    const tabIds = getTabIds(domainGroup) as [number, ...number[]];

    try {
      // Create new group with domain name
      const groupId = await chrome.tabs.group({ tabIds });
      await chrome.tabGroups.update(groupId, { title: domainName });
      console.log(`[Auto-Grouping] Created new group "${domainName}" with ${tabIds.length} ungrouped tabs`);
    } catch (error) {
      console.error(`[Auto-Grouping] Error creating group for domain ${domainName}:`, error);
    }
  }

  console.log('[Auto-Grouping] Domain-based grouping complete');
}

// Check if we should trigger auto-grouping
async function shouldTriggerAutoGrouping(changedDomain: string): Promise<boolean> {
  const [minTabRange] = await getTabRange();
  const domainCounts = await countTabsByDomain();

  const count = domainCounts.get(changedDomain) || 0;
  console.log(`[Auto-Grouping] Domain ${changedDomain} has ${count} ungrouped tabs (threshold: ${minTabRange})`);

  return count >= minTabRange;
}

// Debounce timer for auto-grouping
let autoGroupingTimer: ReturnType<typeof setTimeout> | null = null;

// Schedule auto-grouping with debounce
function scheduleAutoGrouping(): void {
  if (autoGroupingTimer) {
    clearTimeout(autoGroupingTimer);
  }

  autoGroupingTimer = setTimeout(() => {
    runAutoGrouping().catch(error => {
      console.error('[Auto-Grouping] Error:', error);
    });
  }, 3000); // Wait 3 seconds after last tab change
}

// Handle new tab creation
async function handleTabCreated(tab: chrome.tabs.Tab): Promise<void> {
  if (!await isAutoGroupingEnabled()) {
    return;
  }

  // Skip if tab is already grouped
  if (tab.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE) {
    return;
  }

  const tabProps = getTabProps(tab);
  if (!tabProps) return;

  // Wait for tab to load before checking
  setTimeout(async () => {
    try {
      if (!tab.id) return;
      const updatedTab = await chrome.tabs.get(tab.id);
      const updatedProps = getTabProps(updatedTab);
      if (!updatedProps) return;

      // Check if this domain now has enough tabs to trigger grouping
      if (await shouldTriggerAutoGrouping(updatedProps.domain)) {
        scheduleAutoGrouping();
      }
    } catch (error) {
      console.error('[Auto-Grouping] Error checking new tab:', error);
    }
  }, 2000); // Wait 2 seconds for tab to load
}

// Handle tab updates (URL changes, navigation, etc.)
async function handleTabUpdated(
  changeInfo: {url?: string; status?: string},
  tab: chrome.tabs.Tab
): Promise<void> {
  // Only process when URL changes or when status becomes complete
  if (!changeInfo.url && changeInfo.status !== 'complete') {
    return;
  }

  if (!await isAutoGroupingEnabled()) {
    return;
  }

  // Skip if tab is already grouped
  if (tab.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE) {
    return;
  }

  const tabProps = getTabProps(tab);
  if (!tabProps) return;

  // Check if this domain now has enough tabs to trigger grouping
  if (await shouldTriggerAutoGrouping(tabProps.domain)) {
    scheduleAutoGrouping();
  }
}

// Listen for tab events
chrome.tabs.onCreated.addListener((tab) => {
  handleTabCreated(tab).catch(error => {
    console.error('[Auto-Grouping] Error handling tab created:', error);
  });
});

chrome.tabs.onUpdated.addListener((_tabId, changeInfo, tab) => {
  handleTabUpdated(changeInfo, tab).catch(error => {
    console.error('[Auto-Grouping] Error handling tab updated:', error);
  });
});

// Listen for storage changes to enable/disable auto-grouping
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.autoGroupingEnabled) {
    const enabled = changes.autoGroupingEnabled.newValue;
    console.log(`[Auto-Grouping] ${enabled ? 'Enabled' : 'Disabled'}`);

    if (enabled) {
      // Run initial grouping when enabled
      runAutoGrouping().catch(error => {
        console.error('[Auto-Grouping] Error during initial grouping:', error);
      });
    }
  }
});

console.log('[TabIt] Service worker loaded');