<script lang="ts">
  import * as Item from "$lib/components/ui/item/index";
  import * as ContextMenu from "$lib/components/ui/context-menu/index";

  interface Props {
    name: string;
    tabCount: number;
  }
  
  let { name, tabCount }: Props = $props();
  
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

  // Function to get color based on count ranges
  function getColorFromCount(count: number) {
    if (count <= 3) return "#03b151"; // Green
    if (count <= 7) return "#0486ff"; // Blue  
    if (count <= 12) return "#ffab04"; // Orange
    return "#ff4f4f"; // Red
  }

  const badgeColor = $derived(getColorFromCount(tabCount));
  
  // Calculate dynamic height: min 28px to max 60px based on tabCount
  // Linear interpolation: height = 28 + (60-28) * (clamp(tabCount, 1, 10) - 1) / (10 - 1)
  const badgeHeight = $derived.by(() => {
    const clampedCount = Math.max(1, Math.min(10, tabCount));
    const minHeight = 20;
    const maxHeight = 40;
    return Math.floor(minHeight + ((maxHeight - minHeight) * (clampedCount - 1)) / (10 - 1));
  });
</script>

<ContextMenu.Root>
  <ContextMenu.Trigger>
    <Item.Root 
      variant="outline"
    >
      <!-- Tab count badge as media -->
      <Item.Media
        class="w-[28px] rounded-sm border-0 bg-[{badgeColor}]"
        style="height: {badgeHeight}px"
      >
        <span class="text-[12px] text-white font-medium">
          {tabCount}
        </span>
      </Item.Media>
        
      <!-- Group name as content -->
      <Item.Content>
        <Item.Title class="text-[14px]">
          {name}
        </Item.Title>
      </Item.Content>
    </Item.Root>
  </ContextMenu.Trigger>
  
  <ContextMenu.Content>
    <ContextMenu.Item onclick={handleRename}>
      Rename
    </ContextMenu.Item>
    <ContextMenu.Item onclick={handleChangeColor}>
      Change color
    </ContextMenu.Item>
    <ContextMenu.Separator />
    <ContextMenu.Item variant="destructive" onclick={handleUngroup}>
      Ungroup
    </ContextMenu.Item>
  </ContextMenu.Content>
</ContextMenu.Root>
