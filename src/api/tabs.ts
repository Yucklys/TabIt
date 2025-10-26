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
