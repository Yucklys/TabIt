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
export async function getAllTabGroups(): Promise<TabGroup[]> {
  try {
    return await chrome.tabGroups.query({});
  } catch (error) {
    console.error('Error getting tab groups:', error);
    return [];
  }
}

/**
 * Delete a tab group by ID
 */
export async function deleteTabGroup(groupId: number): Promise<boolean> {
  const tabsInGroup = await chrome.tabs.query({ groupId });
  if (tabsInGroup.length == 0) {
    return false;
  }
  tabsInGroup.forEach(tab => {
    if (tab.id !== undefined) {
      chrome.tabs.ungroup(tab.id);
    }
  });
  return true;
}
