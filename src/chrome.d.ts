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
}

export {};
