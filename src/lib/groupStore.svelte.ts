import { getAllTabGroupsWithCounts, createTabGroupFromIds } from '$api/tabGroups';
import { handleRenameGroup } from '$api/renameTabGroup';
import { handleChangeGroupColor } from '$api/recolorTabGroup';
import { handleUngroup } from '$api/ungroupTabs';
import { getSelectedMode } from '$api/storage';
import { MODES } from '$type/groupingMode';

export interface DisplayTab {
  id: number;
  title: string;
  favicon?: string;
  lastAccessTime: number;
}

export interface DisplayGroup {
  groupId: number;
  name: string;
  tabCount: number;
  color: string;
  hexColor: string;
  tabs: DisplayTab[];
}

const COLOR_HEX_MAP: Record<string, string> = {
  grey: '#5f6368',
  blue: '#1a73e8',
  red: '#d93025',
  yellow: '#f9ab00',
  green: '#188038',
  pink: '#d01884',
  purple: '#a142f4',
  cyan: '#007b83',
  orange: '#fa903e',
};

let groups = $state<DisplayGroup[]>([]);
let error = $state<string | null>(null);

export function getGroups(): DisplayGroup[] {
  return groups;
}

export function getError(): string | null {
  return error;
}

export async function loadGroups(): Promise<void> {
  try {
    error = null;
    const groupsWithCounts = await getAllTabGroupsWithCounts();

    const loaded: DisplayGroup[] = [];
    for (const { group, count } of groupsWithCounts) {
      const tabs = await chrome.tabs.query({ groupId: group.id });
      const displayTabs: DisplayTab[] = tabs.map((tab) => ({
        id: tab.id!,
        title: tab.title || 'Untitled',
        favicon: tab.favIconUrl,
        lastAccessTime: tab.lastAccessed ?? Date.now(),
      }));

      loaded.push({
        groupId: group.id,
        name: group.title || 'Unnamed',
        tabCount: count,
        color: group.color || 'grey',
        hexColor: COLOR_HEX_MAP[group.color || 'grey'] || COLOR_HEX_MAP.grey,
        tabs: displayTabs,
      });
    }

    groups = loaded;
  } catch (err) {
    console.error('Error loading groups:', err);
    error = err instanceof Error ? err.message : 'Failed to load groups';
  }
}

export async function runGrouping(): Promise<void> {
  try {
    error = null;
    const mode = await getSelectedMode();
    const modeConfig = MODES[mode];

    // Run the grouping function (categorizes tabs and saves to session storage)
    await modeConfig.groupingFunction();

    // Read categorized result from session storage
    const session = await chrome.storage.session.get([
      'categorizedResult',
      'categorizationStatus',
      'categorizationError',
    ]);

    if (session.categorizationStatus === 'error') {
      throw new Error(session.categorizationError || 'Grouping failed');
    }

    const categorized = session.categorizedResult as
      | { [category: string]: [number, ...number[]] }
      | undefined;

    if (categorized && Object.keys(categorized).length > 0) {
      // Create Chrome tab groups from the categorized result
      for (const [categoryName, tabIds] of Object.entries(categorized)) {
        await createTabGroupFromIds(tabIds as [number, ...number[]], categoryName);
      }
    }

    // Reload groups to reflect the new state
    await loadGroups();
  } catch (err) {
    console.error('Error running grouping:', err);
    error = err instanceof Error ? err.message : 'Grouping failed';
    // Still reload to show whatever state exists
    await loadGroups();
  }
}

export async function renameGroup(groupId: number, newTitle: string): Promise<void> {
  await handleRenameGroup(groupId, newTitle);
  await loadGroups();
}

export async function changeGroupColor(
  groupId: number,
  currentColor: chrome.tabGroups.Color | undefined,
): Promise<void> {
  await handleChangeGroupColor(groupId, currentColor);
  await loadGroups();
}

export async function ungroupGroup(groupId: number): Promise<void> {
  await handleUngroup(groupId);
  await loadGroups();
}

export async function activateTab(tabId: number): Promise<void> {
  const tab = await chrome.tabs.update(tabId, { active: true });
  if (tab?.windowId) {
    await chrome.windows.update(tab.windowId, { focused: true });
  }
}
