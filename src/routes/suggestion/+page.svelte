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

  const now = Date.now();

  const groups = [
    {
      name: "Group 1: Entertainment",
      tabCount: 5,
      color: "#ff4f4f",
      tabs: [
        {
          id: "1",
          title: "Spotify - Liked Songs",
          favicon: "https://www.spotify.com/favicon.ico",
          lastAccessTime: now - 2 * 60 * 1000, // 2 minutes ago
        },
        {
          id: "2",
          title: "Spotify - Liked Songs",
          lastAccessTime: now - 5 * 60 * 1000, // 5 minutes ago
        },
        {
          id: "3",
          title: "Spotify - Liked Songs",
          lastAccessTime: now - 10 * 60 * 1000, // 10 minutes ago
        },
        {
          id: "4",
          title: "Spotify - Liked Songs",
          lastAccessTime: now - 15 * 60 * 1000, // 15 minutes ago
        },
        {
          id: "5",
          title: "Spotify - Liked Songs",
          lastAccessTime: now - 20 * 60 * 1000, // 20 minutes ago
        },
      ],
    },
    {
      name: "Group 2: News",
      tabCount: 8,
      color: "#ffab04",
      tabs: [],
    },
    {
      name: "Group 3: Shopping",
      tabCount: 1,
      color: "#0486ff",
      tabs: [],
    },
  ];
</script>

<main>
  <Card.Root class="w-[420px] p-8">
    <!-- Header logo and title -->
    <Header/>

    <!-- Tab Groups Header -->
    <div class="mb-6">
      <h2 class="text-[16px] font-medium text-[#111827] mb-1">Tab Groups</h2>
      <p class="text-[12px] text-[#9ca3af] font-normal">
        {groups.length} {groups.length === 1 ? 'group' : 'groups'} active
      </p>
    </div>

    <!-- Groups list -->
    <ScrollArea class="h-[300px] mb-6">
      <div class="space-y-4 pr-4">
        {#each groups as group, index (group.name + index)}
          <Group
            name={group.name}
            tabCount={group.tabCount}
            color={group.color}
            tabs={group.tabs}
          />
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
