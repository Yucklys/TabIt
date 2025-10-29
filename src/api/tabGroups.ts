import { getTabIdsByIndices } from "./tabs";

type TabGroup = chrome.tabGroups.TabGroup;

/**
 * Create a tab group with given tab indices and name
 */
export async function createTabGroup(indice: [number, ...number[]], groupName: string): Promise<TabGroup | null> {
  try {
    // Validate input
    if (!indice || indice.length === 0) {
      console.error('No tab index provided');
      return null;
    }

    if (!groupName || groupName.trim() === '') {
      console.error('No group name provided');
      return null;
    }

    const tabIds = await getTabIdsByIndices(indice);

    if (tabIds.length) {
      const groupId = await chrome.tabs.group({
        tabIds,
      });
      await chrome.tabGroups.update(groupId, {
        title: groupName.trim()
      });
    
      return await chrome.tabGroups.get(groupId);
    }
    return null;
  } catch (error) {
    console.error('Error creating tab group:', error);
    return null;
  }
}

/**
 * Create multiple tab groups from categorized tabs
 */
export async function createTabGroupsFromCategories(categorizedTabs: { [category: string]: [number, ...number[]] }): Promise<TabGroup[]> {
  const createdGroups: TabGroup[] = [];
  
  try {
    for (const [category, tabIndices] of Object.entries(categorizedTabs)) {
      if (tabIndices.length > 0) {
        const group = await createTabGroup(tabIndices, category);
        if (group) {
          createdGroups.push(group);
        }
      }
    }
    
    return createdGroups;
  } catch (error) {
    console.error('Error creating tab groups from categories:', error);
    return createdGroups;
  }
}

/**
 * Get all existing tab groups
 */
export async function getAllTabGroups(): Promise<TabGroup[]> {
  try {
    return await chrome.tabGroups.query({});
  } catch (error) {
    console.error('Error getting tab groups:', error);
    return [];
  }
}

/**
 * Get tab count for a specific group
 */
export async function getTabCountForGroup(groupId: number): Promise<number> {
  try {
    const tabs = await chrome.tabs.query({ groupId });
    return tabs.length;
  } catch (error) {
    console.error('Error getting tab count for group:', error);
    return 0;
  }
}

/**
 * Get all tab groups with their tab counts
 */
export async function getAllTabGroupsWithCounts(): Promise<{ group: TabGroup; count: number }[]> {
  try {
    const groups = await chrome.tabGroups.query({});
    const groupsWithCounts = await Promise.all(
      groups.map(async (group) => {
        const count = await getTabCountForGroup(group.id);
        return { group, count };
      })
    );
    return groupsWithCounts;
  } catch (error) {
    console.error('Error getting tab groups with counts:', error);
    return [];
  }
}

/**
 * Delete a tab group by ID (ungroup all tabs in the group)
 */
export async function deleteTabGroup(groupId: number): Promise<boolean> {
  try {
    const tabs = await chrome.tabs.query({ groupId });
    for (const tab of tabs) {
      if (tab.id !== undefined) {
        await chrome.tabs.ungroup(tab.id);
      }
    }
    return true;
  } catch (error) {
    console.error('Error deleting tab group:', error);
    return false;
  }
}
