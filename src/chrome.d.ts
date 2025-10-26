declare namespace chrome {
  namespace tabs {
    interface Tab {
      id?: number;
      index: number;
      windowId: number;
      openerTabId?: number;
      highlighted: boolean;
      active: boolean;
      pinned: boolean;
      audible?: boolean;
      discarded: boolean;
      autoDiscardable: boolean;
      mutedInfo?: MutedInfo;
      url?: string;
      pendingUrl?: string;
      title?: string;
      favIconUrl?: string;
      status?: string;
      incognito: boolean;
      width?: number;
      height?: number;
      sessionId?: string;
      groupId?: number;
    }

    interface MutedInfo {
      muted: boolean;
      reason?: string;
      extensionId?: string;
    }

    function query(queryInfo: any, callback: (result: Tab[]) => void): void;
    function query(queryInfo: any): Promise<Tab[]>;
  }

  namespace tabGroups {
    const TAB_GROUP_ID_NONE: number;
  }

  namespace runtime {
    interface LastError {
      message?: string;
    }
    const lastError: LastError | undefined;
  }
}
