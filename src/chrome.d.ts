// Chrome Extension API type definitions
declare namespace chrome {
  namespace runtime {
    function sendMessage(message: any): Promise<any>;
    function sendMessage(message: any, callback: (response: any) => void): void;
  }

  namespace tabs {
    function create(createProperties: { url: string }): void;
    function query(queryInfo: { currentWindow: boolean }): Promise<Tab[]>;
    function remove(tabId: number): Promise<void>;
    function group(options: { groupId: number; tabIds: number[] }): Promise<void>;
  }

  namespace tabGroups {
    function create(createProperties: { windowId?: number }): Promise<number>;
    function update(groupId: number, updateProperties: { title?: string; color?: string; collapsed?: boolean }): Promise<void>;
  }

  interface Tab {
    id: number;
    title: string;
    url: string;
    favIconUrl?: string;
    groupId?: number;
  }
}
