<script lang="ts">
  import { onMount } from "svelte";
  import Group from "$lib/components/Group.svelte";
  import Header from "$lib/components/Header.svelte";
  import SuggestionSkeleton from "$lib/components/SuggestionSkeleton.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Card from "$lib/components/ui/card/index";
  import { Switch } from "$lib/components/ui/switch/index";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index";
  import { navigate, getIsLoading, Route } from "$lib/router.svelte";
  import { getGroups, loadGroups, runGrouping } from "$lib/groupStore.svelte";
  import { getAutoGroupingEnabled, setAutoGroupingEnabled } from "$api/storage";
  import { t } from "$lib/i18n.svelte";

  let autoGrouping = $state(false);
  let toggling = $state(false);
  let regrouping = $state(false);

  onMount(async () => {
    autoGrouping = await getAutoGroupingEnabled();
    await loadGroups();
  });

  async function handleToggle(checked: boolean) {
    toggling = true;
    try {
      if (checked) {
        await setAutoGroupingEnabled(true);
        autoGrouping = true;
      } else {
        await setAutoGroupingEnabled(false);
        autoGrouping = false;
      }
    } catch (err) {
      console.error('Error toggling auto grouping:', err);
      // Revert on failure
      autoGrouping = !checked;
    } finally {
      toggling = false;
    }
  }

  async function handleRegroup() {
    regrouping = true;
    try {
      await runGrouping();
    } catch (err) {
      console.error('Error running smart regroup:', err);
    } finally {
      regrouping = false;
    }
  }
</script>

<main>
  <Card.Root class="w-[420px] h-[600px] p-8 flex flex-col gap-3">
    <!-- Header logo and title -->
    <Header/>

    {#if getIsLoading() || toggling || regrouping}
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

    <!-- Action area -->
    {#if getIsLoading() || toggling || regrouping}
      <div class="w-full shrink-0 mt-4 flex items-center justify-center py-4">
        <p class="text-[14px] text-muted-foreground font-medium">{t('suggestion.loading')}</p>
      </div>
    {:else}
      <div class="w-full shrink-0 mt-4 flex flex-col gap-3">
        <!-- Action buttons row -->
        <div class="flex gap-2">
          <Button class="flex-1" onclick={handleRegroup}>{t('suggestion.smart_regroup')}</Button>
          <Button variant="outline" class="flex-1" onclick={() => navigate(Route.Customize)}>{t('suggestion.customize')}</Button>
        </div>
        <!-- Auto Grouping toggle row -->
        <div class="flex items-center justify-between">
          <div class="flex flex-col gap-0.5">
            <span class="text-[14px] font-medium text-foreground">{t('suggestion.auto_grouping')}</span>
            <span class="text-[11px] text-muted-foreground">{t('suggestion.auto_grouping_desc')}</span>
          </div>
          <Switch
            checked={autoGrouping}
            onCheckedChange={handleToggle}
          />
        </div>
      </div>
    {/if}
  </Card.Root>
</main>
