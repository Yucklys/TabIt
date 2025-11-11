import { getAllTabGroupsWithCounts } from "./tabGroups.ts";

/**
 * Rename a tab group with validation and refresh
 */
export async function handleRenameGroup(groupId: number, newTitle: string): Promise<{
  success: boolean;
  groups?: { group: chrome.tabGroups.TabGroup; count: number }[];
}> {
  try {
    // Validate input
    if (!newTitle.trim()) {
      return { success: false };
    }

    // Rename the group using Chrome API
    await chrome.tabGroups.update(groupId, { title: newTitle.trim() });

    // Get updated groups list
    const groups = await getAllTabGroupsWithCounts();
    
    return {
      success: true,
      groups
    };
  } catch (error) {
    console.error('Error in handleRenameGroup:', error);
    return { success: false };
  }
}

