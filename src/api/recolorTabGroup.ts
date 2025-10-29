/**
 * Available colors for tab groups
 */
export const AVAILABLE_COLORS = [
  'grey',
  'blue', 
  'red', 
  'yellow', 
  'green', 
  'pink', 
  'purple', 
  'cyan',
  'orange'
] as const;

type ColorType = typeof AVAILABLE_COLORS[number];

/**
 * Change color of a tab group to a specific color
 */
export async function setGroupColor(
  groupId: number, 
  color: chrome.tabGroups.Color
): Promise<{
  success: boolean;
  newColor?: chrome.tabGroups.Color;
}> {
  try {
    // Update color using Chrome API
    await chrome.tabGroups.update(groupId, { color });
    
    return {
      success: true,
      newColor: color
    };
  } catch (error) {
    console.error('Error in setGroupColor:', error);
    return { success: false };
  }
}

/**
 * Cycle to next color (deprecated, kept for compatibility)
 */
export async function handleChangeGroupColor(
  groupId: number, 
  currentColor: chrome.tabGroups.Color | undefined
): Promise<{
  success: boolean;
  newColor?: chrome.tabGroups.Color;
}> {
  // Get current color or default to first color
  const current = currentColor || AVAILABLE_COLORS[0];
  const currentIndex = AVAILABLE_COLORS.indexOf(current as ColorType);
  const nextIndex = (currentIndex + 1) % AVAILABLE_COLORS.length;
  const nextColor = AVAILABLE_COLORS[nextIndex] as chrome.tabGroups.Color;

  return await setGroupColor(groupId, nextColor);
}

/**
 * Cycle to next color
 */
export function getNextColor(currentColor: chrome.tabGroups.Color | undefined): chrome.tabGroups.Color {
  const current = currentColor || AVAILABLE_COLORS[0];
  const currentIndex = AVAILABLE_COLORS.indexOf(current as ColorType);
  const nextIndex = (currentIndex + 1) % AVAILABLE_COLORS.length;
  return AVAILABLE_COLORS[nextIndex] as chrome.tabGroups.Color;
}

