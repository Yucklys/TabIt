<script lang="ts">
  import Group from "$lib/components/Group.svelte";
  import Header from "$lib/components/Header.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as ButtonGroup from "$lib/components/ui/button-group/index";
  import * as Card from "$lib/components/ui/card/index";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index";

  interface Props {
    navigate: (route: string) => void;
  }

  let { navigate }: Props = $props();

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
  <Card.Root class="w-[420px] h-[600px] p-8 flex flex-col gap-3">
    <!-- Header logo and title -->
    <Header/>

    <!-- Tab Groups Header -->
    <div class="mb-4 shrink-0">
      <h2 class="text-[16px] font-medium text-[#111827] mb-1">Tab Groups</h2>
      <p class="text-[12px] text-[#9ca3af] font-normal">
        {groups.length} {groups.length === 1 ? 'group' : 'groups'} active
      </p>
    </div>

    <!-- Groups list -->
    <ScrollArea class="flex-1 min-h-0">
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
    <ButtonGroup.Root orientation="vertical" class="w-full shrink-0 mt-4">
      <Button variant="default">Smart Regroup</Button>
      <Button variant="outline" onclick={() => navigate('customize')}>Customize</Button>
    </ButtonGroup.Root>
  </Card.Root>
</main>
