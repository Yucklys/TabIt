import { extractDomain, extractPath } from '@/utils/url';
import type { TabProps } from '@/type/tabProps';

const defaultTabFilters = {
  pinned: false
};

export const getUngroupedTabs = (): Promise<chrome.tabs.Tab[]> => {
  return chrome.tabs.query({ ...defaultTabFilters, groupId: chrome.tabGroups.TAB_GROUP_ID_NONE })
};

const getTabInfo = (tab: chrome.tabs.Tab): TabProps | null => {
  if (tab.id === undefined) {
    return null;
  }
  const url = tab.url || '';
  return {
    id: tab.id,
    title: tab.title || '',
    domain: extractDomain(url),
    path: extractPath(url)
  };
}

export const getTabProps = (tabs: chrome.tabs.Tab[]): TabProps[] => {
  return tabs
    .map(tab => getTabInfo(tab))
    .filter((tab): tab is TabProps => tab !== null);
}

export const getTitleById = async (tabIds: [number, ...number[]]): Promise<string[]> => {
  const titles: string[] = [];

  for (const id of tabIds) {
    const tab = await chrome.tabs.get(id);
    if (tab.title) {
      titles.push(tab.title);
    }
  }

  return titles;
}
