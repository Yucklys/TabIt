<script lang="ts">
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index";
  import { EllipsisVertical, ArrowRight } from "@lucide/svelte";

  interface Tab {
    id: string;
    title: string;
    favicon?: string;
    lastAccessTime: number; // Unix timestamp in milliseconds
  }

  interface Props {
    name: string;
    tabCount: number;
    color?: string;
    tabs?: Tab[];
  }

  let { name, tabCount, color = "#ff4f4f", tabs = [] }: Props = $props();

  let isExpanded = $state(false);

  // Generate human-readable timestamp from lastAccessTime
  function formatTimestamp(lastAccessTime: number): string {
    const now = Date.now();
    const diffMs = now - lastAccessTime;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}min${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours}hr${diffHours > 1 ? "s" : ""} ago`;
    return `${diffDays}day${diffDays > 1 ? "s" : ""} ago`;
  }

  // Sort tabs by last access time in descending order (most recent first)
  const sortedTabs = $derived(
    [...tabs].sort((a, b) => b.lastAccessTime - a.lastAccessTime)
  );

  const handleRename = () => {
    console.log('Rename group:', name);
    // TODO: Implement rename functionality
  };

  const handleChangeColor = () => {
    console.log('Change color for group:', name);
    // TODO: Implement color change functionality
  };

  const handleUngroup = () => {
    console.log('Ungroup:', name);
    // TODO: Implement ungroup functionality
  };

  const toggleExpand = () => {
    isExpanded = !isExpanded;
  };

  const handleTabClick = (tabId: string) => {
    console.log('Navigate to tab:', tabId);
    // TODO: Implement tab navigation
  };
</script>

<div class="group-container">
  <button class="group-item" onclick={toggleExpand}>
    <!-- Colored badge -->
    <div
      class="badge"
      style="background-color: {color}"
    ></div>

    <!-- Group name -->
    <span class="group-name">{name}</span>

    <!-- Tab count -->
    <span class="tab-count">{tabCount}</span>

    <!-- Three-dot menu -->
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        class="menu-button"
        aria-label="Group options"
        onclick={(e) => e.stopPropagation()}
      >
        <EllipsisVertical size={16} />
      </DropdownMenu.Trigger>

      <DropdownMenu.Content>
        <DropdownMenu.Item onclick={handleRename}>
          Rename
        </DropdownMenu.Item>
        <DropdownMenu.Item onclick={handleChangeColor}>
          Change color
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item variant="destructive" onclick={handleUngroup}>
          Ungroup
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </button>

  {#if isExpanded && sortedTabs.length > 0}
    <div class="tabs-list">
      {#each sortedTabs as tab, index (tab.id)}
        <button
          class="tab-item"
          class:highlighted={index === 0}
          onclick={() => handleTabClick(tab.id)}
        >
          <div class="tab-favicon">
            {#if tab.favicon}
              <img src={tab.favicon} alt="" width="20" height="20" />
            {:else}
              <div class="favicon-placeholder"></div>
            {/if}
          </div>

          <span class="tab-title">{tab.title}</span>

          <span class="tab-timestamp">{formatTimestamp(tab.lastAccessTime)}</span>

          <ArrowRight size={20} class="tab-arrow" />
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .group-container {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .group-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    background: white;
    transition: all 0.2s;
    width: 100%;
    text-align: left;
    cursor: pointer;
    position: relative;
    z-index: 1;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.08);
  }

  .group-item:hover {
    background: #f9fafb;
  }

  .badge {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    flex-shrink: 0;
  }

  .group-name {
    flex: 1;
    font-size: 14px;
    font-weight: 400;
    color: #111827;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .tab-count {
    font-size: 14px;
    font-weight: 400;
    color: #6b7280;
    margin-right: 8px;
    background: #f3f4f6;
    padding: 4px 12px;
    border-radius: 8px;
  }

  .tabs-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px;
    background: white;
    border: 1px solid #e5e7eb;
    border-top: none;
    border-radius: 0 0 12px 12px;
    margin-top: -12px;
    padding-top: 16px;
    max-height: 200px;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .tabs-list::-webkit-scrollbar {
    width: 6px;
  }

  .tabs-list::-webkit-scrollbar-track {
    background: transparent;
  }

  .tabs-list::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;
  }

  .tabs-list::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }

  .tab-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border: none;
    border-radius: 8px;
    background: white;
    transition: all 0.2s;
    width: 100%;
    text-align: left;
    cursor: pointer;
  }

  .tab-item:hover {
    background: #f9fafb;
  }

  .tab-item.highlighted {
    background: #eff6ff;
  }

  .tab-favicon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .favicon-placeholder {
    width: 20px;
    height: 20px;
    border-radius: 4px;
    background: #e5e7eb;
  }

  .tab-title {
    flex: 1;
    font-size: 14px;
    font-weight: 400;
    color: #111827;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .tab-timestamp {
    font-size: 12px;
    font-weight: 400;
    color: #9ca3af;
    margin-right: 8px;
  }

  .tab-item :global(.tab-arrow) {
    color: #3b82f6;
    flex-shrink: 0;
  }
</style>
