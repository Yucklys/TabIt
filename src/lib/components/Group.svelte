<script lang="ts">
  import * as Item from "$lib/components/ui/item/index";

  interface Props {
    name: string;
    tabCount: number;
  }
  
  let { name, tabCount }: Props = $props();

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
  <!-- Tab count badge as media -->
  <Item.Media variant="icon" class="size-[28px] rounded-[6px] border-0" style="background-color: {badgeColor}">
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
