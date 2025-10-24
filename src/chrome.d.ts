// Chrome Extension API type definitions
declare namespace chrome {
  // Runtime API
  namespace runtime {
    const lastError: { message: string } | undefined;
    
    function sendMessage(message: any): Promise<any>;
    function sendMessage(message: any, callback: (response: any) => void): void;
    
    const onMessage: {
      addListener(
        callback: (
          message: any,
          sender: MessageSender,
          sendResponse: (response: any) => void
        ) => boolean | void
      ): void;
    };
  }

  interface MessageSender {
    tab?: Tab;
    frameId?: number;
    id?: string;
    url?: string;
    tlsChannelId?: string;
  }

  // Tabs API
  namespace tabs {
    function create(createProperties: CreateProperties): Promise<Tab>;
    function create(createProperties: CreateProperties, callback: (tab: Tab) => void): void;
    
    function query(queryInfo: QueryInfo): Promise<Tab[]>;
    function query(queryInfo: QueryInfo, callback: (tabs: Tab[]) => void): void;
    
    function remove(tabIds: number | number[]): Promise<void>;
    function remove(tabIds: number | number[], callback: () => void): void;
    
    function update(tabId: number, updateProperties: UpdateProperties): Promise<Tab>;
    function update(tabId: number, updateProperties: UpdateProperties, callback: (tab: Tab) => void): void;
    
    function group(options: GroupOptions): Promise<number>;
    function group(options: GroupOptions, callback: (groupId: number) => void): void;
    
    function ungroup(tabIds: number | number[]): Promise<void>;
    function ungroup(tabIds: number | number[], callback: () => void): void;
    
    function reload(tabId?: number, reloadProperties?: ReloadProperties): Promise<void>;
    function reload(tabId: number, reloadProperties: ReloadProperties, callback: () => void): void;
    
    function duplicate(tabId: number): Promise<Tab>;
    function duplicate(tabId: number, callback: (tab: Tab) => void): void;
    
    function move(tabIds: number | number[], moveProperties: MoveProperties): Promise<Tab | Tab[]>;

    // Tab Events
    const onCreated: {
      addListener(callback: (tab: Tab) => void): void;
    };
    
    const onUpdated: {
      addListener(callback: (tabId: number, changeInfo: any, tab: Tab) => void): void;
    };
    
    const onRemoved: {
      addListener(callback: (tabId: number, removeInfo: any) => void): void;
    };
    
    const onActivated: {
      addListener(callback: (activeInfo: { tabId: number; windowId: number }) => void): void;
    };
  }

  interface CreateProperties {
    url?: string;
    active?: boolean;
    pinned?: boolean;
    index?: number;
    windowId?: number;
  }

  interface QueryInfo {
    active?: boolean;
    pinned?: boolean;
    audible?: boolean;
    muted?: boolean;
    highlighted?: boolean;
    currentWindow?: boolean;
    lastFocusedWindow?: boolean;
    status?: 'loading' | 'complete';
    title?: string;
    url?: string | string[];
    windowId?: number;
    windowType?: 'normal' | 'popup' | 'panel' | 'app' | 'devtools';
    index?: number;
  }

  interface UpdateProperties {
    url?: string;
    active?: boolean;
    highlighted?: boolean;
    pinned?: boolean;
    muted?: boolean;
    openerTabId?: number;
  }

  interface GroupOptions {
    tabIds: number | number[];
    groupId?: number;
  }

  interface ReloadProperties {
    bypassCache?: boolean;
  }

  interface MoveProperties {
    windowId?: number;
    index: number;
  }

  interface Tab {
    id: number;
    index: number;
    windowId: number;
    openerTabId?: number;
    selected: boolean;
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
    status?: 'loading' | 'complete';
    incognito: boolean;
    width?: number;
    height?: number;
    sessionId?: string;
    groupId: number;
  }

  interface MutedInfo {
    muted: boolean;
    reason?: 'user' | 'capture' | 'extension';
    extensionId?: string;
  }

  // Tab Groups API
  namespace tabGroups {
    function query(queryInfo: TabGroupQueryInfo): Promise<TabGroup[]>;
    function query(queryInfo: TabGroupQueryInfo, callback: (groups: TabGroup[]) => void): void;
    
    function create(createProperties: TabGroupCreateProperties): Promise<number>;
    function create(createProperties: TabGroupCreateProperties, callback: (groupId: number) => void): void;
    
    function update(groupId: number, updateProperties: TabGroupUpdateProperties): Promise<TabGroup>;
    function update(groupId: number, updateProperties: TabGroupUpdateProperties, callback: (group: TabGroup) => void): void;
    
    function move(groupId: number, moveProperties: { index: number }): Promise<TabGroup>;
    
    function get(groupId: number): Promise<TabGroup>;
    function get(groupId: number, callback: (group: TabGroup) => void): void;

    // Tab Group Events
    const onCreated: {
      addListener(callback: (group: TabGroup) => void): void;
    };
    
    const onUpdated: {
      addListener(callback: (group: TabGroup) => void): void;
    };
    
    const onRemoved: {
      addListener(callback: (group: TabGroup) => void): void;
    };
  }

  interface TabGroupQueryInfo {
    collapsed?: boolean;
    color?: TabGroupColor;
    title?: string;
    windowId?: number;
  }

  interface TabGroupCreateProperties {
    windowId?: number;
  }

  interface TabGroupUpdateProperties {
    collapsed?: boolean;
    color?: TabGroupColor;
    title?: string;
  }

  type TabGroupColor = 'grey' | 'blue' | 'red' | 'yellow' | 'green' | 'pink' | 'purple' | 'cyan';

  interface TabGroup {
    id: number;
    collapsed: boolean;
    color: TabGroupColor;
    title?: string;
    windowId: number;
  }

  // Storage API
  namespace storage {
    namespace local {
      function get(keys?: string | string[] | null): Promise<{ [key: string]: any }>;
      function get(keys: string | string[] | null, callback: (items: { [key: string]: any }) => void): void;
      
      function set(items: { [key: string]: any }): Promise<void>;
      function set(items: { [key: string]: any }, callback: () => void): void;
      
      function remove(keys: string | string[]): Promise<void>;
      function remove(keys: string | string[], callback: () => void): void;
      
      function clear(): Promise<void>;
      function clear(callback: () => void): void;
      
      function getBytesInUse(keys?: string | string[] | null): Promise<number>;
      function getBytesInUse(keys: string | string[] | null, callback: (bytes: number) => void): void;
    }

    namespace sync {
      function get(keys?: string | string[] | null): Promise<{ [key: string]: any }>;
      function get(keys: string | string[] | null, callback: (items: { [key: string]: any }) => void): void;
      
      function set(items: { [key: string]: any }): Promise<void>;
      function set(items: { [key: string]: any }, callback: () => void): void;
      
      function remove(keys: string | string[]): Promise<void>;
      function remove(keys: string | string[], callback: () => void): void;
      
      function clear(): Promise<void>;
      function clear(callback: () => void): void;
    }

    const onChanged: {
      addListener(
        callback: (
          changes: { [key: string]: StorageChange },
          areaName: 'sync' | 'local' | 'managed'
        ) => void
      ): void;
    };
  }

  interface StorageChange {
    oldValue?: any;
    newValue?: any;
  }

  // Bookmarks API
  namespace bookmarks {
    function create(bookmark: BookmarkCreateArg): Promise<BookmarkTreeNode>;
    function create(bookmark: BookmarkCreateArg, callback: (result: BookmarkTreeNode) => void): void;
    
    function get(idOrIdList: string | string[]): Promise<BookmarkTreeNode[]>;
    function get(idOrIdList: string | string[], callback: (results: BookmarkTreeNode[]) => void): void;
    
    function getTree(): Promise<BookmarkTreeNode[]>;
    function getTree(callback: (results: BookmarkTreeNode[]) => void): void;
    
    function search(query: string | BookmarkSearchQuery): Promise<BookmarkTreeNode[]>;
    function search(query: string | BookmarkSearchQuery, callback: (results: BookmarkTreeNode[]) => void): void;
    
    function update(id: string, changes: BookmarkChangesArg): Promise<BookmarkTreeNode>;
    function update(id: string, changes: BookmarkChangesArg, callback: (result: BookmarkTreeNode) => void): void;
    
    function remove(id: string): Promise<void>;
    function remove(id: string, callback: () => void): void;
    
    function removeTree(id: string): Promise<void>;
    function removeTree(id: string, callback: () => void): void;
  }

  interface BookmarkCreateArg {
    parentId?: string;
    index?: number;
    title?: string;
    url?: string;
  }

  interface BookmarkSearchQuery {
    query?: string;
    url?: string;
    title?: string;
  }

  interface BookmarkChangesArg {
    title?: string;
    url?: string;
  }

  interface BookmarkTreeNode {
    id: string;
    parentId?: string;
    index?: number;
    url?: string;
    title: string;
    dateAdded?: number;
    dateGroupModified?: number;
    unmodifiable?: 'managed';
    children?: BookmarkTreeNode[];
  }

  // Scripting API
  namespace scripting {
    function executeScript(injection: ScriptInjection): Promise<InjectionResult[]>;
    function executeScript(injection: ScriptInjection, callback: (results: InjectionResult[]) => void): void;
    
    function insertCSS(injection: CSSInjection): Promise<void>;
    function insertCSS(injection: CSSInjection, callback: () => void): void;
    
    function removeCSS(injection: CSSInjection): Promise<void>;
    function removeCSS(injection: CSSInjection, callback: () => void): void;
  }

  interface ScriptInjection {
    target: InjectionTarget;
    func?: (...args: any[]) => any;
    args?: any[];
    files?: string[];
    world?: 'ISOLATED' | 'MAIN';
  }

  interface CSSInjection {
    target: InjectionTarget;
    css?: string;
    files?: string[];
  }

  interface InjectionTarget {
    tabId: number;
    frameIds?: number[];
    documentIds?: string[];
    allFrames?: boolean;
  }

  interface InjectionResult {
    result?: any;
    error?: any;
  }

  // Windows API
  namespace windows {
    const WINDOW_ID_NONE: number;
    const WINDOW_ID_CURRENT: number;
    
    function get(windowId: number, queryOptions?: QueryOptions): Promise<Window>;
    function get(windowId: number, queryOptions: QueryOptions, callback: (window: Window) => void): void;
    
    function getCurrent(queryOptions?: QueryOptions): Promise<Window>;
    function getCurrent(queryOptions: QueryOptions, callback: (window: Window) => void): void;
    
    function getAll(queryOptions?: QueryOptions): Promise<Window[]>;
    function getAll(queryOptions: QueryOptions, callback: (windows: Window[]) => void): void;
    
    function create(createData?: CreateData): Promise<Window>;
    function create(createData: CreateData, callback: (window: Window) => void): void;
    
    function update(windowId: number, updateInfo: UpdateInfo): Promise<Window>;
    function update(windowId: number, updateInfo: UpdateInfo, callback: (window: Window) => void): void;
    
    function remove(windowId: number): Promise<void>;
    function remove(windowId: number, callback: () => void): void;
  }

  interface QueryOptions {
    populate?: boolean;
    windowTypes?: WindowType[];
  }

  interface CreateData {
    url?: string | string[];
    tabId?: number;
    left?: number;
    top?: number;
    width?: number;
    height?: number;
    focused?: boolean;
    incognito?: boolean;
    type?: WindowType;
    state?: WindowState;
  }

  interface UpdateInfo {
    left?: number;
    top?: number;
    width?: number;
    height?: number;
    focused?: boolean;
    drawAttention?: boolean;
    state?: WindowState;
  }

  type WindowType = 'normal' | 'popup' | 'panel' | 'app' | 'devtools';
  type WindowState = 'normal' | 'minimized' | 'maximized' | 'fullscreen' | 'locked-fullscreen';

  interface Window {
    id: number;
    focused: boolean;
    top?: number;
    left?: number;
    width?: number;
    height?: number;
    tabs?: Tab[];
    incognito: boolean;
    type?: WindowType;
    state?: WindowState;
    alwaysOnTop: boolean;
    sessionId?: string;
  }
}
