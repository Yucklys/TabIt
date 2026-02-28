<script lang="ts">
  import { onMount } from "svelte";
  import Group from "$lib/components/Group.svelte";
  import Header from "$lib/components/Header.svelte";
  import SuggestionSkeleton from "$lib/components/SuggestionSkeleton.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as ButtonGroup from "$lib/components/ui/button-group/index";
  import * as Card from "$lib/components/ui/card/index";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index";
  import { navigate, getIsLoading, navigateWithLoading, Route } from "$lib/router.svelte";
  import { getGroups, loadGroups, runGrouping } from "$lib/groupStore.svelte";
  import { t } from "$lib/i18n.svelte";

  onMount(() => {
    loadGroups();
  });
</script>

<main>
  <Card.Root class="w-[420px] h-[600px] p-8 flex flex-col gap-3">
    <!-- Header logo and title -->
    <Header/>

    {#if getIsLoading()}
      <SuggestionSkeleton />
    {:else}
      <!-- Tab Groups Header -->
      <div class="mb-4 shrink-0">
        <h2 class="text-[16px] font-medium text-foreground mb-1">{t('suggestion.tab_groups')}</h2>
        <p class="text-[12px] text-muted-foreground font-normal">
          {t('suggestion.groups_active', { count: getGroups().length })}
        </p>
      </div>

      <!-- Groups list -->
      <ScrollArea class="flex-1 min-h-0">
        <div class="space-y-4 pr-4">
          {#if getGroups().length === 0}
            <div class="flex flex-col items-center justify-center py-12 text-center">
              <p class="text-[14px] text-muted-foreground font-normal">{t('suggestion.no_groups')}</p>
              <p class="text-[12px] text-muted-foreground font-normal mt-1">{t('suggestion.no_groups_hint')}</p>
            </div>
          {:else}
            {#each getGroups() as group (group.groupId)}
              <Group
                name={group.name}
                tabCount={group.tabCount}
                color={group.hexColor}
                tabs={group.tabs}
                groupId={group.groupId}
                chromeColor={group.color}
                onMutated={loadGroups}
              />
            {/each}
          {/if}
        </div>
      </ScrollArea>
    {/if}

    <!-- Action buttons / loading status -->
    {#if getIsLoading()}
      <div class="w-full shrink-0 mt-4 flex items-center justify-center py-4">
        <p class="text-[14px] text-muted-foreground font-medium">{t('suggestion.loading')}</p>
      </div>
    {:else}
      <ButtonGroup.Root orientation="vertical" class="w-full shrink-0 mt-4">
        <Button variant="default" onclick={() => navigateWithLoading(Route.Suggestion, runGrouping)}>{t('suggestion.smart_regroup')}</Button>
        <Button variant="outline" onclick={() => navigate(Route.Customize)}>{t('suggestion.customize')}</Button>
      </ButtonGroup.Root>
    {/if}
  </Card.Root>
</main>
