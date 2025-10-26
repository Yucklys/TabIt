export interface TabInfo {
  index: number;
  url: string;
  title: string;
}

const defaultTabFilters = {
  pinned: false
};

export const getUngroupedTabs = (): Promise<chrome.tabs.Tab[]> => {
  return chrome.tabs.query({ ...defaultTabFilters, groupId: chrome.tabGroups.TAB_GROUP_ID_NONE })
};

const getTabInfo = (tab: chrome.tabs.Tab, index: number): TabInfo => {
  return {
    index,
    url: tab.url || '',
    title: tab.title || ''
  };
}

export const getTabInfoList = (tabs: chrome.tabs.Tab[]): TabInfo[] => {
  // Keep original index even for invalid tabs
  return tabs.map(tab => getTabInfo(tab, tab.index));
}

export const getTabIdsByIndices = async (tabIndices: number[]): Promise<[number, ...number[]]> => {
  const allTabs = await chrome.tabs.query({});
  const tabIds: number[] = [];
  
  for (const index of tabIndices) {
    const tab = allTabs.find(tab => tab.index === index);
    if (tab && tab.id !== undefined) {
      tabIds.push(tab.id);
    }
  }
  
  if (tabIds.length === 0) {
    throw new Error('No valid tab IDs found for the given indices');
  }
  
  return tabIds as [number, ...number[]];
}
