import '../chrome.d.ts';

export interface TabGroupInfo {
  id: number;
  title: string;
  color: string;
  collapsed: boolean;
}

import '../chrome.d.ts';

export interface TabGroupInfo {
  id: number;
  title: string;
  color: string;
  collapsed: boolean;
}

/**
 * Create a tab group with given tab indices and name
 */
export async function createTabGroup(tabIds: number[], groupName: string): Promise<TabGroupInfo | null> {
  try {
    // Validate input
    if (!tabIds || tabIds.length === 0) {
      console.error('No tab IDs provided');
      return null;
    }

    if (!groupName || groupName.trim() === '') {
      console.error('No group name provided');
      return null;
    }

    // Check if chrome.tabGroups exists
    if (!chrome.tabGroups) {
      console.error('chrome.tabGroups API not available');
      return null;
    }

    // First, group the tabs together using chrome.tabs.group
    const groupId = await chrome.tabs.group({
      tabIds: tabIds
    });

    // Then update the group with title using chrome.tabGroups.update
    await chrome.tabGroups.update(groupId, {
      title: groupName.trim()
    });
    
    return {
      id: groupId,
      title: groupName.trim(),
      color: 'grey', // Default color
      collapsed: false
    };

  } catch (error) {
    console.error('Error creating tab group:', error);
    return null;
  }
}

/**
 * Create multiple tab groups from categorized tabs
 */
export async function createTabGroupsFromCategories(categorizedTabs: { [category: string]: number[] }): Promise<TabGroupInfo[]> {
  const createdGroups: TabGroupInfo[] = [];
  
  try {
    for (const [category, tabIndices] of Object.entries(categorizedTabs)) {
      if (tabIndices.length > 0) {
        const group = await createTabGroup(tabIndices, category);
        if (group) {
          createdGroups.push(group);
        }
      }
    }
    
    console.log(`Created ${createdGroups.length} tab groups`);
    return createdGroups;
    
  } catch (error) {
    console.error('Error creating tab groups from categories:', error);
    return createdGroups;
  }
}

/**
 * Get all existing tab groups
 */
export async function getAllTabGroups(): Promise<TabGroupInfo[]> {
  try {
    const groups = await chrome.tabGroups.query({});
    return groups.map(group => ({
      id: group.id,
      title: group.title || 'Untitled',
      color: group.color || 'grey',
      collapsed: group.collapsed || false
    }));
  } catch (error) {
    console.error('Error getting tab groups:', error);
    return [];
  }
}

/**
 * Delete a tab group by ID
 */
export async function deleteTabGroup(groupId: number): Promise<boolean> {
  try {
    await chrome.tabGroups.remove(groupId);
    console.log(`Deleted tab group ${groupId}`);
    return true;
  } catch (error) {
    console.error('Error deleting tab group:', error);
    return false;
  }
}

/**
 * Create tab group from tab indices and group name
 * @param tabIndices Array of tab indices (0, 1, 2, etc.)
 * @param groupName Name for the tab group
 */
export async function createGroupFromIndices(tabIndices: number[], groupName: string): Promise<TabGroupInfo | null> {
  try {
    const allTabs = await chrome.tabs.query({});
    return await createGroupFromIndicesWithTabs(tabIndices, groupName, allTabs);
  } catch (error) {
    console.error('Error creating group from indices:', error);
    return null;
  }
}

/**
 * Create tab group from tab indices and group name with pre-fetched tabs
 * @param tabIndices Array of tab indices (0, 1, 2, etc.)
 * @param groupName Name for the tab group
 * @param allTabs Pre-fetched tabs array
 */
export async function createGroupFromIndicesWithTabs(tabIndices: number[], groupName: string, allTabs: chrome.tabs.Tab[]): Promise<TabGroupInfo | null> {
  try {
    
    // Convert indices to tab IDs
    const tabIds: number[] = [];
    for (const index of tabIndices) {
      const tab = allTabs.find(t => t.index === index);
      if (tab?.id) {
        tabIds.push(tab.id);
      }
    }
    
    if (tabIds.length === 0) {
      return null;
    }
    
    // Create the group
    return await createTabGroup(tabIds, groupName);
    
  } catch (error) {
    console.error('Error creating group from indices:', error);
    return null;
  }
}
