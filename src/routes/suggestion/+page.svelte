<script lang="ts">
  import Group from "$lib/components/Group.svelte";
  import Header from "$lib/components/Header.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as ButtonGroup from "$lib/components/ui/button-group/index";
  import * as Card from "$lib/components/ui/card/index";
  import { Label } from "$lib/components/ui/label/index";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index";

  // Image assets from Figma
  const img =
    "https://www.figma.com/api/mcp/asset/d9bcebb5-d999-46a6-9526-85c1703b750a";

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

<main>
  <Card.Root class="w-[420px] p-8">
    <!-- Header logo and title -->
    <Header class="mb-6" mode="Smart" />

    <!-- AI Suggested Group Header -->
    <div>
      <div class="flex items-center gap-3">
        <div class="size-[24px] relative">
          <div class="absolute inset-[8.33%_8.33%_0.78%_8.73%]">
            <img
              alt=""
              class="block max-w-none size-full"
              src={img}
              id="logo"
            />
          </div>
        </div>
        <h2 class="text-[14px]">AI Suggested Group</h2>
      </div>

      <!-- Subtitle using Label -->
      <Label
        for="logo"
        class="text-[12px] text-[#717182] font-normal ml-[35px]"
      >
        Choose the pre-made grouping for quick setup
      </Label>
    </div>

    <!-- Groups list -->
    <ScrollArea class="h-[300px] mb-6">
      <div class="space-y-4 pr-4">
        {#each groups as group, index (group.name + index)}
          <Group name={group.name} tabCount={group.tabCount} />
        {/each}
      </div>
    </ScrollArea>

    <!-- Action buttons using ButtonGroup -->
    <ButtonGroup.Root orientation="vertical" class="w-full">
      <Button variant="default">Confirm Grouping</Button>
      <Button variant="outline">Customize</Button>
    </ButtonGroup.Root>
  </Card.Root>
</main>
