import { getAllTabGroupsWithCounts } from "./tabGroups.ts";

/**
 * Ungroup tabs and return updated groups list
 */
export async function handleUngroup(groupId: number): Promise<{
  success: boolean;
  groups?: { group: chrome.tabGroups.TabGroup; count: number }[];
}> {
  try {
    // Ungroup the tabs using Chrome API
    const tabs = await chrome.tabs.query({ groupId });
    for (const tab of tabs) {
      if (tab.id !== undefined) {
        await chrome.tabs.ungroup(tab.id);
      }
    }

    // Get updated groups list
    const groups = await getAllTabGroupsWithCounts();
    
    return {
      success: true,
      groups
    };
  } catch (error) {
    console.error('Error in handleUngroup:', error);
    return { success: false };
  }
}

