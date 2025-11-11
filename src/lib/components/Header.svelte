<script lang="ts">
  import { cn } from "$lib/utils";
  import * as Select from "$lib/components/ui/select/index";
  import { MODES, type GroupingMode } from "$type/groupingMode";

  interface Props {
    class?: string;
  }

  let { class: className = "" }: Props = $props();

  let selectedMode = $state<GroupingMode>("smart");

  const groupingModes = Object.values(MODES).map((mode) => ({
    value: mode.id,
    label: mode.name,
  }));

  const selectedLabel = $derived(MODES[selectedMode].name);
</script>

<div class={cn("flex items-center justify-between", className)}>
  <div class="flex items-center gap-3">
    <!-- Tabit logo -->
    <div class="relative w-[19px] h-[19px]">
      <div
        class="absolute bg-[#ff4f4f] w-[9px] h-[7px] rounded-[2px] top-[12px] left-[10px]"
      ></div>
      <div
        class="absolute bg-[#ffab04] w-[9px] h-[12px] rounded-[2px] top-[7px] left-0"
      ></div>
      <div
        class="absolute bg-[#0486ff] w-[9px] h-[11px] rounded-[2px] top-0 left-[10px]"
      ></div>
      <div
        class="absolute bg-[#03b151] w-[9px] h-[5px] rounded-[2px] top-0 left-0"
      ></div>
    </div>
    <h1>TabIt</h1>
  </div>

  <Select.Root
    type="single"
    onValueChange={(newMode) => (selectedMode = newMode as GroupingMode)}
    items={groupingModes}
    bind:value={selectedMode}
  >
    <Select.Trigger>
      Mode: {selectedLabel}
    </Select.Trigger>
    <Select.Content>
      {#each groupingModes as mode}
        <Select.Item value={mode.value} label={mode.label}>
          {mode.label}
        </Select.Item>
      {/each}
    </Select.Content>
  </Select.Root>
</div>
