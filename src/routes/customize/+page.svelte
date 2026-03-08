<script lang="ts">
  import { onMount } from "svelte";
  import Header from "$lib/components/Header.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as ButtonGroup from "$lib/components/ui/button-group/index";
  import * as Card from "$lib/components/ui/card/index";
  import { Label } from "$lib/components/ui/label/index";
  import { Slider } from "$lib/components/ui/slider/index";
  import { navigate, navigateWithLoading, Route } from "$lib/router.svelte";
  import { getUserSettings, saveUserSettings } from "$services/storage";
  import { runGrouping } from "$lib/groupStore.svelte";
  import { t } from "$lib/i18n.svelte";

  // Slider state
  let tabCount = $state([1, 6]);
  let granularity = $state<"few_groups" | "moderate" | "many_groups">("moderate");

  const granularityOptions: {
    labelKey: string;
    value: "few_groups" | "moderate" | "many_groups";
    ratio: number;
  }[] = [
    { labelKey: "customize.few_groups", value: "few_groups", ratio: 0.3 },
    { labelKey: "customize.moderate", value: "moderate", ratio: 0.5 },
    { labelKey: "customize.many_groups", value: "many_groups", ratio: 0.7 },
  ];

  const thresholdToGranularity: Record<number, "few_groups" | "moderate" | "many_groups"> = {
    0.3: "few_groups",
    0.5: "moderate",
    0.7: "many_groups",
  };

  function getGranularity(): number {
    return granularityOptions.find((o) => o.value === granularity)?.ratio ?? 0.5;
  }

  onMount(async () => {
    const settings = await getUserSettings();
    if (settings.tabRange) {
      tabCount = [...settings.tabRange];
    }
    if (settings.similarityThreshold != null) {
      granularity =
        thresholdToGranularity[settings.similarityThreshold] ?? "moderate";
    }
  });

  async function handleConfirm() {
    await saveUserSettings({
      tabRange: [tabCount[0], tabCount[1]] as [number, number],
      similarityThreshold: getGranularity(),
    });
    await navigateWithLoading(Route.Suggestion, runGrouping);
  }
</script>

<main>
  <Card.Root class="w-[420px] h-[600px] p-8 flex flex-col gap-3 rounded-none border-0">
    <Header />

    <div class="flex-1 min-h-0 flex flex-col gap-4 overflow-y-auto">
      <!-- Number of Tabs -->
      <div class="shrink-0">
        <Label class="text-[14px] text-foreground font-normal mb-2 block">
          {t("customize.tabs_per_group")}
        </Label>
        <div class="slider-container">
          <div class="slider-endpoint">
            <span class="slider-hint">{t("customize.min")}</span>
            <span class="slider-label">{tabCount[0]}</span>
          </div>
          <Slider type="multiple" bind:value={tabCount} min={1} max={20} step={1} />
          <div class="slider-endpoint">
            <span class="slider-hint">{t("customize.max")}</span>
            <span class="slider-label">{tabCount[1]}</span>
          </div>
        </div>
      </div>

      <!-- Grouping Granularity -->
      <div class="shrink-0">
        <Label class="text-[14px] text-foreground font-normal mb-2 block">
          {t("customize.granularity")}
        </Label>
        <div class="granularity-options">
          {#each granularityOptions as option (option.value)}
            <Button
              variant={granularity === option.value ? "default" : "secondary"}
              class="flex-1 flex-col h-auto py-3 gap-1"
              onclick={() => (granularity = option.value)}
            >
              <span class="text-sm font-medium">{t(option.labelKey)}</span>
              <span
                class="text-xs {granularity === option.value
                  ? 'text-primary-foreground/70'
                  : 'text-muted-foreground'}">{option.ratio}</span
              >
            </Button>
          {/each}
        </div>
      </div>
    </div>

    <!-- Action buttons -->
    <ButtonGroup.Root orientation="vertical" class="w-full shrink-0 mt-4">
      <Button variant="default" onclick={handleConfirm}
        >{t("customize.confirm")}</Button
      >
      <Button variant="outline" onclick={() => navigate(Route.Suggestion)}
        >{t("customize.cancel")}</Button
      >
    </ButtonGroup.Root>
  </Card.Root>
</main>

<style>
  .slider-container {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 16px 12px;
    border: 1px solid var(--color-border);
    border-radius: 5px;
    background: var(--color-card);
    position: relative;
  }

  .slider-endpoint {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    flex-shrink: 0;
  }

  .slider-hint {
    font-size: 11px;
    color: var(--color-muted-foreground);
  }

  .slider-label {
    font-size: 14px;
    font-weight: 500;
    color: var(--color-foreground);
  }

  .granularity-options {
    display: flex;
    gap: 8px;
  }
</style>
