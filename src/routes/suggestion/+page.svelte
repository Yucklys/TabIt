<script lang="ts">
  import { cn } from "$lib/utils";
  import Group from "$lib/components/Group.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as ButtonGroup from "$lib/components/ui/button-group/index.ts";
  import * as Card from "$lib/components/ui/card/index.ts";
  import { Label } from "$lib/components/ui/label/index.ts";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.ts";

  // Image assets from Figma
  const imgVector = "https://www.figma.com/api/mcp/asset/7dc238cb-08b9-4ef0-8281-f9882d7b6d86";
  const img = "https://www.figma.com/api/mcp/asset/d9bcebb5-d999-46a6-9526-85c1703b750a";

  const groups = [
    { name: "Group 1: Entertainment", tabCount: 5 },
    { name: "Group 2: News", tabCount: 10 },
    { name: "Group 3: Shopping", tabCount: 1 },
    { name: "Group 4: Shopping", tabCount: 1 },
    { name: "Group 5: Shopping", tabCount: 1 },
    { name: "Group 6: Shopping", tabCount: 1 },
    { name: "Group 5: Shopping", tabCount: 1 },
    { name: "Group 5: Shopping", tabCount: 1 },
    { name: "Group 5: Shopping", tabCount: 1 },
  ];
</script>

<svelte:head>
  <title>AI Suggested Groups - Tabit</title>
</svelte:head>

<main class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
  <Card.Root class="w-[420px] p-8">
	{#snippet children()}
    <!-- Header logo and title -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <!-- Tabit logo -->
        <div class="relative w-[19px] h-[19px]">
          <div class="absolute bg-[#ff4f4f] w-[9px] h-[7px] rounded-[2px] top-[12px] left-[10px]"></div>
          <div class="absolute bg-[#ffab04] w-[9px] h-[12px] rounded-[2px] top-[7px] left-0"></div>
          <div class="absolute bg-[#0486ff] w-[9px] h-[11px] rounded-[2px] top-0 left-[10px]"></div>
          <div class="absolute bg-[#03b151] w-[9px] h-[5px] rounded-[2px] top-0 left-0"></div>
        </div>
        <h1 class="font-['Audiowide:Regular',sans-serif] text-[16px] text-black">Tabit</h1>
      </div>
      
      <!-- Mode selector -->
      <div class="bg-[#f3f3f5] flex items-center gap-[10px] px-[7px] py-1 rounded-[12px]">
        <span class="font-['Arial:Regular',sans-serif] text-[14px] text-[#717182]">Mode: Smart</span>
        <div class="relative size-[24px]">
          <div class="absolute inset-[41.67%_29.17%_37.5%_29.17%]">
            <img alt="" class="block max-w-none size-full" src={imgVector} />
          </div>
        </div>
      </div>
    </div>

    <!-- AI Suggested Group Header -->
    <div>
      <div class="flex items-center gap-3">
        <div class="size-[24px] relative">
          <div class="absolute inset-[8.33%_8.33%_0.78%_8.73%]">
            <img alt="" class="block max-w-none size-full" src={img} id="logo" />
          </div>
        </div>
        <h2 class="font-['Arial:Regular',sans-serif] text-[14px]">
          AI Suggested Group
        </h2>
      </div>
      
      <!-- Subtitle using Label -->
      <Label for="logo" class="font-['Arial:Regular',sans-serif] text-[12px] text-[#717182] font-normal ml-[35px]">
        Choose the pre-made grouping for quick setup
      </Label>
    </div>

    <!-- Groups list -->
    <ScrollArea class="h-[300px] mb-6">
      {#snippet children()}
        <div class="space-y-4 pr-4">
          {#each groups as group}
            <Group name={group.name} tabCount={group.tabCount} />
          {/each}
        </div>
      {/snippet}
    </ScrollArea>

    <!-- Action buttons using ButtonGroup -->
    <ButtonGroup.Root orientation="vertical" class="w-full">
      <Button 
        variant="default" 
      >
        {#snippet children()}Confirm Grouping{/snippet}
      </Button>
      <Button 
        variant="outline" 
      >
        {#snippet children()}Customize{/snippet}
      </Button>
    </ButtonGroup.Root>
    {/snippet}
  </Card.Root>
</main>
