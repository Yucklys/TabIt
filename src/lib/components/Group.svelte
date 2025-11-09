<script lang="ts">
  import { cn } from "$lib/utils";
  import * as Item from "$lib/components/ui/item/index.ts";

  interface Props {
    name: string;
    tabCount: number;
    class?: string;
  }
  
  let { name, tabCount, class: className = "" }: Props = $props();

  // Function to get color based on count ranges
  function getColorFromCount(count: number) {
    if (count <= 3) return "#03b151"; // Green
    if (count <= 7) return "#0486ff"; // Blue  
    if (count <= 12) return "#ffab04"; // Orange
    return "#ff4f4f"; // Red
  }

  const badgeColor = $derived(getColorFromCount(tabCount));
</script>

<Item.Root 
  variant="outline"
>
  {#snippet children()}
    <!-- Tab count badge as media -->
    <Item.Media variant="icon" class="size-[28px] rounded-[6px] border-0" style="background-color: {badgeColor}">
      {#snippet children()}
        <span class="text-[12px] text-white font-medium">
          {tabCount}
        </span>
      {/snippet}
    </Item.Media>
    
    <!-- Group name as content -->
    <Item.Content>
      {#snippet children()}
        <Item.Title class="text-[14px]">
          {#snippet children()}{name}{/snippet}
        </Item.Title>
      {/snippet}
    </Item.Content>
  {/snippet}
</Item.Root>
