declare global {
  namespace chrome {
            namespace tabs {
              interface Tab {
                id?: number;
                index: number;
                url?: string;
                title?: string;
                pinned: boolean;
              }

              function query(queryInfo: object, callback: (result: Tab[]) => void): void;
              function query(queryInfo: object): Promise<Tab[]>;
              function group(options: { tabIds: number[], groupId?: number }): Promise<number>;
            }

    namespace tabGroups {
      const TAB_GROUP_ID_NONE: number;
      
      interface TabGroup {
        id: number;
        title?: string;
        color?: string;
        collapsed?: boolean;
        windowId: number;
      }
      
      function update(groupId: number, updateProperties: { title?: string, color?: string }): Promise<TabGroup | undefined>;
      function query(queryInfo: object): Promise<TabGroup[]>;
      function remove(groupId: number): Promise<void>;
      function get(groupId: number): Promise<TabGroup>;
      function move(groupId: number, moveProperties: object): Promise<TabGroup | undefined>;
    }

    namespace runtime {
      interface LastError {
        message?: string;
      }
      const lastError: LastError | undefined;
    }
  }
}

export {};
