<script lang="ts">
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index";
  import { EllipsisVertical, ArrowRight } from "@lucide/svelte";
  import {
    renameGroupAction,
    ungroupGroupAction,
    activateTab,
    setGroupColor
  } from "$lib/groupStore.svelte";
  import { t } from "$lib/i18n.svelte";

  const COLOR_OPTIONS: { color: string; hex: string }[] = [
    { color: "grey", hex: "#5f6368" },
    { color: "blue", hex: "#1a73e8" },
    { color: "red", hex: "#d93025" },
    { color: "yellow", hex: "#f9ab00" },
    { color: "green", hex: "#188038" },
    { color: "pink", hex: "#d01884" },
    { color: "purple", hex: "#a142f4" },
    { color: "cyan", hex: "#007b83" },
    { color: "orange", hex: "#fa903e" },
  ];

  interface Tab {
    id: number;
    title: string;
    favicon?: string;
    lastAccessTime: number; // Unix timestamp in milliseconds
  }

  interface Props {
    name: string;
    tabCount: number;
    color?: string;
    tabs?: Tab[];
    groupId: number;
    chromeColor?: string;
    onMutated?: () => Promise<void>;
  }

  let { name, tabCount, color = "#ff4f4f", tabs = [], groupId, chromeColor, onMutated }: Props = $props();

  let isExpanded = $state(false);
  let isEditing = $state(false);
  let editValue = $state("");
  let inputRef: HTMLInputElement | undefined = $state();

  // Generate human-readable timestamp from lastAccessTime
  function formatTimestamp(lastAccessTime: number): string {
    const now = Date.now();
    const diffMs = now - lastAccessTime;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return t('group.just_now');
    if (diffMins < 60) return t('group.mins_ago', { n: diffMins });
    if (diffHours < 24) return t('group.hrs_ago', { n: diffHours });
    return t('group.days_ago', { n: diffDays });
  }

  // Sort tabs by last access time in descending order (most recent first)
  const sortedTabs = $derived(
    [...tabs].sort((a, b) => b.lastAccessTime - a.lastAccessTime)
  );

  const startRename = () => {
    editValue = name;
    isEditing = true;
    setTimeout(() => inputRef?.focus(), 0);
  };

  const cancelRename = () => {
    isEditing = false;
    editValue = "";
  };

  const saveRename = async () => {
    const newTitle = editValue.trim();
    if (newTitle && newTitle !== name) {
      await renameGroupAction(groupId, newTitle);
      await onMutated?.();
    }
    isEditing = false;
    editValue = "";
  };

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveRename();
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancelRename();
    }
  };

  const handleSelectColor = async (color: string) => {
    await setGroupColor(groupId, color as chrome.tabGroups.Color);
    await onMutated?.();
  };

  const handleUngroup = async () => {
    await ungroupGroupAction(groupId);
    await onMutated?.();
  };

  const toggleExpand = () => {
    isExpanded = !isExpanded;
  };

  const handleTabClick = async (tabId: number) => {
    await activateTab(tabId);
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
    {#if isEditing}
      <input
        bind:this={inputRef}
        type="text"
        class="rename-input"
        bind:value={editValue}
        onkeydown={handleKeydown}
        onblur={saveRename}
        onclick={(e) => e.stopPropagation()}
      />
    {:else}
      <span class="group-name">{name}</span>
    {/if}

    <!-- Tab count -->
    <span class="tab-count">{tabCount}</span>

    <!-- Three-dot menu -->
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        class="menu-button"
        aria-label={t('group.options_aria')}
        onclick={(e) => e.stopPropagation()}
      >
        <EllipsisVertical size={16} />
      </DropdownMenu.Trigger>

      <DropdownMenu.Content>
        <DropdownMenu.Item onclick={startRename}>
          {t('group.rename')}
        </DropdownMenu.Item>
        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger>
            {t('group.change_color')}
          </DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent side="left" class="!duration-0 data-[state=closed]:!animate-none mr-2">
              <div class="color-grid">
              {#each COLOR_OPTIONS as opt}
                <button
                  class="color-option"
                  class:selected={chromeColor === opt.color}
                  style="background-color: {opt.hex}"
                  onclick={() => handleSelectColor(opt.color)}
                >
                  {#if chromeColor === opt.color}
                    <span class="checkmark">✓</span>
                  {/if}
                </button>
              {/each}
              </div>
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
        <DropdownMenu.Separator />
        <DropdownMenu.Item variant="destructive" onclick={handleUngroup}>
          {t('group.ungroup')}
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
    border: 1px solid var(--color-border);
    border-radius: 12px;
    background: var(--color-card);
    transition: all 0.2s;
    width: 100%;
    text-align: left;
    cursor: pointer;
    position: relative;
    z-index: 1;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.08);
  }

  .group-item:hover {
    background: var(--color-accent);
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
    color: var(--color-foreground);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .rename-input {
    flex: 1;
    font-size: 14px;
    font-weight: 400;
    color: var(--color-foreground);
    background: var(--color-background);
    border: 1px solid var(--color-primary);
    border-radius: 4px;
    padding: 4px 8px;
    outline: none;
  }

  .tab-count {
    font-size: 14px;
    font-weight: 400;
    color: var(--color-muted-foreground);
    margin-right: 8px;
    background: var(--color-muted);
    padding: 4px 12px;
    border-radius: 8px;
  }

  .tabs-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px;
    background: var(--color-card);
    border: 1px solid var(--color-border);
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
    background: var(--color-border);
    border-radius: 3px;
  }

  .tabs-list::-webkit-scrollbar-thumb:hover {
    background: var(--color-muted-foreground);
  }

  .tab-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border: none;
    border-radius: 8px;
    background: var(--color-card);
    transition: all 0.2s;
    width: 100%;
    text-align: left;
    cursor: pointer;
  }

  .tab-item:hover {
    background: var(--color-accent);
  }

  .tab-item.highlighted {
    background: var(--color-accent);
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
    background: var(--color-muted);
  }

  .tab-title {
    flex: 1;
    font-size: 14px;
    font-weight: 400;
    color: var(--color-foreground);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .tab-timestamp {
    font-size: 12px;
    font-weight: 400;
    color: var(--color-muted-foreground);
    margin-right: 8px;
  }

  .tab-item :global(.tab-arrow) {
    color: var(--color-primary);
    flex-shrink: 0;
  }

  .color-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 6px;
    padding: 8px;
  }

  .color-option {
    width: 24px;
    height: 24px;
    border-radius: 6px;
    border: 2px solid transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.15s;
  }

  .color-option:hover {
    transform: scale(1.1);
  }

  .color-option.selected {
    border-color: var(--color-foreground);
  }

  .checkmark {
    color: white;
    font-size: 12px;
    font-weight: bold;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  }
</style>
