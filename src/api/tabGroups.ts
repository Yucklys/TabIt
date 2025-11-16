import { getTabIdsByIndices } from "./tabs";

type TabGroup = chrome.tabGroups.TabGroup;

/**
 * Create a tab group with given tab indices, name, and optional color
 */
export async function createTabGroup(
  indice: [number, ...number[]], 
  groupName: string, 
  color?: chrome.tabGroups.Color
): Promise<TabGroup | null> {
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

    return await createTabGroupFromIds(tabIds, groupName, color);
  } catch (error) {
    console.error('Error creating tab group:', error);
    return null;
  }
}

/**
 * Create a tab group with given tab IDs, name, and optional color
 */
export async function createTabGroupFromIds(
  tabIds: [number, ...number[]], 
  groupName: string, 
  color?: chrome.tabGroups.Color
): Promise<TabGroup | null> {
  try {
    const groupId = await chrome.tabs.group({
      tabIds,
    });
    
    const updateParams: { title: string; color?: chrome.tabGroups.Color } = {
      title: groupName.trim()
    };
    
    if (color) {
      updateParams.color = color;
    }
    
    await chrome.tabGroups.update(groupId, updateParams);
  
    return await chrome.tabGroups.get(groupId);
  } catch (error) {
    console.error('Error creating tab group from IDs:', error);
    return null;
  }
}

/**
 * Check if a tab group with the given name already exists
 */
export async function findExistingGroupByName(groupName: string): Promise<TabGroup | null> {
  try {
    const groups = await chrome.tabGroups.query({});
    const existingGroup = groups.find(group => group.title === groupName);
    return existingGroup || null;
  } catch (error) {
    console.error('Error finding existing group:', error);
    return null;
  }
}

/**
 * Add tabs to an existing group by group ID using tab IDs
 */
export async function addTabsToExistingGroup(
  groupId: number, 
  tabIds: [number, ...number[]],
  color?: chrome.tabGroups.Color
): Promise<TabGroup | null> {
  try {
    // Add new tabs to the existing group
    await chrome.tabs.group({ groupId, tabIds });
    
    // Update color if provided
    if (color) {
      await chrome.tabGroups.update(groupId, { color });
    }
    
    return await chrome.tabGroups.get(groupId);
  } catch (error) {
    console.error('Error adding tabs to existing group:', error);
    return null;
  }
}

/**
 * Create multiple tab groups from categorized tabs with custom names and colors
 */
export async function createTabGroupsFromCategories(
  categorizedTabs: { [category: string]: [number, ...number[]] },
  customNames?: { [category: string]: string },
  customColors?: { [category: string]: chrome.tabGroups.Color }
): Promise<TabGroup[]> {
  const createdGroups: TabGroup[] = [];
  
  try {
    console.log('Creating tab groups with custom names:', customNames);
    console.log('Creating tab groups with custom colors:', customColors);
    
    for (const [category, tabIndices] of Object.entries(categorizedTabs)) {
      if (tabIndices.length > 0) {
        // Use custom name if provided, otherwise use category
        const groupName = customNames?.[category] || category;
        // Use custom color if provided
        const color = customColors?.[category];
        
        console.log(`Creating group: ${category} -> name: ${groupName}, color: ${color}`);
        
        const group = await createTabGroup(tabIndices, groupName, color);
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
