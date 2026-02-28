<script lang="ts">
  import { onMount } from "svelte";
  import Header from "$lib/components/Header.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as ButtonGroup from "$lib/components/ui/button-group/index";
  import * as Card from "$lib/components/ui/card/index";
  import { Label } from "$lib/components/ui/label/index";
  import { Slider } from "$lib/components/ui/slider/index";
  import { ChevronDown } from "@lucide/svelte";
  import { navigate, navigateWithLoading, Route } from "$lib/router.svelte";
  import { getUserSettings, saveUserSettings } from "$api/storage";
  import { runGrouping } from "$lib/groupStore.svelte";
  import { t } from "$lib/i18n.svelte";

  // Category state — keys map to i18n, values are the English identifiers stored in settings
  const allCategories: { key: string; value: string }[] = [
    { key: "customize.cat_social_media", value: "Social Media" },
    { key: "customize.cat_entertainment", value: "Entertainment" },
    { key: "customize.cat_news", value: "News" },
    { key: "customize.cat_research", value: "Research" },
    { key: "customize.cat_shopping", value: "Shopping" },
    { key: "customize.cat_documentation", value: "Documentation" },
    { key: "customize.cat_work", value: "Work" },
    { key: "customize.cat_email", value: "Email" },
  ];

  let selectedCategories = $state<string[]>([]);
  let dropdownOpen = $state(false);

  function toggleCategory(value: string) {
    if (selectedCategories.includes(value)) {
      selectedCategories = selectedCategories.filter((c) => c !== value);
    } else {
      selectedCategories = [...selectedCategories, value];
    }
  }

  /** Get the i18n display label for a stored category value. */
  function categoryLabel(value: string): string {
    const cat = allCategories.find((c) => c.value === value);
    return cat ? t(cat.key) : value;
  }

  // Slider state
  let tabCount = $state([1, 6]);
  let similarity = $state<'low' | 'medium' | 'high'>('high');

  const similarityOptions: { labelKey: string; value: 'low' | 'medium' | 'high'; ratio: number }[] = [
    { labelKey: 'customize.low', value: 'low', ratio: 0.3 },
    { labelKey: 'customize.medium', value: 'medium', ratio: 0.5 },
    { labelKey: 'customize.high', value: 'high', ratio: 0.7 },
  ];

  const thresholdToSimilarity: Record<number, 'low' | 'medium' | 'high'> = {
    0.3: 'low',
    0.5: 'medium',
    0.7: 'high',
  };

  function getSimilarityThreshold(): number {
    return similarityOptions.find(o => o.value === similarity)?.ratio ?? 0.7;
  }

  // Additional rules
  let additionalRules = $state("");

  onMount(async () => {
    const settings = await getUserSettings();
    if (settings.customGroups && settings.customGroups.length > 0) {
      selectedCategories = settings.customGroups;
    }
    if (settings.tabRange) {
      tabCount = [...settings.tabRange];
    }
    if (settings.similarityThreshold != null) {
      similarity = thresholdToSimilarity[settings.similarityThreshold] ?? 'high';
    }
    if (settings.customPrompt) {
      additionalRules = settings.customPrompt;
    }
  });

  async function handleConfirm() {
    await saveUserSettings({
      customGroups: selectedCategories,
      tabRange: [tabCount[0], tabCount[1]] as [number, number],
      similarityThreshold: getSimilarityThreshold(),
      customPrompt: additionalRules,
    });
    await navigateWithLoading(Route.Suggestion, runGrouping);
  }
</script>

<main>
  <Card.Root class="w-[420px] h-[600px] p-8 flex flex-col gap-3">
    <Header />

    <div class="flex-1 min-h-0 flex flex-col gap-4 overflow-y-auto">
      <!-- Choose or Enter Categories -->
      <div class="shrink-0">
        <Label class="text-[14px] text-foreground font-normal mb-2 block">
          {t('customize.categories_label')}
        </Label>
        <div class="category-selector">
          <button
            class="category-input"
            onclick={() => (dropdownOpen = !dropdownOpen)}
          >
            <div class="tags-row">
              {#each selectedCategories.slice(0, 3) as category (category)}
                <span class="tag">{categoryLabel(category)}</span>
              {/each}
              {#if selectedCategories.length > 3}
                <span class="tag-ellipsis">...</span>
                <span class="tag tag-count">{selectedCategories.length}</span>
              {/if}
            </div>
            <ChevronDown size={20} />
          </button>

          {#if dropdownOpen}
            <div class="category-dropdown">
              <div class="category-grid">
                {#each allCategories as category (category.value)}
                  <button
                    class="category-option"
                    onclick={() => toggleCategory(category.value)}
                  >
                    <div
                      class="checkbox"
                      class:checked={selectedCategories.includes(category.value)}
                    ></div>
                    <span>{t(category.key)}</span>
                  </button>
                {/each}
              </div>
            </div>
          {/if}
        </div>
      </div>

      <!-- Number of Tabs -->
      <div class="shrink-0">
        <Label class="text-[14px] text-foreground font-normal mb-2 block">
          {t('customize.tabs_per_group')}
        </Label>
        <div class="slider-container">
          <div class="slider-endpoint">
            <span class="slider-hint">{t('customize.min')}</span>
            <span class="slider-label">{tabCount[0]}</span>
          </div>
          <Slider bind:value={tabCount} min={1} max={20} step={1} />
          <div class="slider-endpoint">
            <span class="slider-hint">{t('customize.max')}</span>
            <span class="slider-label">{tabCount[1]}</span>
          </div>
        </div>
      </div>

      <!-- Additional Rules -->
      <div class="shrink-0">
        <Label class="text-[14px] text-foreground font-normal mb-2 block">
          {t('customize.additional_rules')}
        </Label>
        <textarea
          class="rules-textarea"
          placeholder={t('customize.rules_placeholder')}
          bind:value={additionalRules}
        ></textarea>
      </div>

      <!-- Grouping Similarity -->
      <div class="shrink-0">
        <Label class="text-[14px] text-foreground font-normal mb-2 block">
          {t('customize.similarity')}
        </Label>
        <div class="similarity-options">
          {#each similarityOptions as option (option.value)}
            <Button
              variant={similarity === option.value ? "default" : "secondary"}
              class="flex-1 flex-col h-auto py-3 gap-1"
              onclick={() => (similarity = option.value)}
            >
              <span class="text-sm font-medium">{t(option.labelKey)}</span>
              <span class="text-xs {similarity === option.value ? 'text-primary-foreground/70' : 'text-muted-foreground'}">{option.ratio}</span>
            </Button>
          {/each}
        </div>
      </div>
    </div>

    <!-- Action buttons -->
    <ButtonGroup.Root orientation="vertical" class="w-full shrink-0 mt-4">
      <Button variant="default" onclick={handleConfirm}>{t('customize.confirm')}</Button>
      <Button variant="outline" onclick={() => navigate(Route.Suggestion)}>{t('customize.cancel')}</Button>
    </ButtonGroup.Root>
  </Card.Root>
</main>

<style>
  .category-selector {
    position: relative;
  }

  .category-input {
    display: flex;
    align-items: center;
    width: 100%;
    min-height: 52px;
    padding: 8px 12px;
    border: 0.8px solid var(--color-border);
    border-radius: 8px;
    background: var(--color-card);
    cursor: pointer;
    text-align: left;
  }

  .tags-row {
    display: flex;
    align-items: center;
    gap: 6px;
    flex: 1;
    flex-wrap: wrap;
  }

  .tag {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 6px 12px;
    background: var(--color-primary);
    color: var(--color-primary-foreground);
    font-size: 12px;
    border-radius: 10px;
    white-space: nowrap;
  }

  .tag-ellipsis {
    font-size: 12px;
    color: var(--color-foreground);
    padding: 0 2px;
  }

  .tag-count {
    min-width: 29px;
    padding: 6px 0;
    text-align: center;
  }

  .category-input :global(.chevron) {
    color: var(--color-muted-foreground);
    flex-shrink: 0;
  }

  .category-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 10;
    background: var(--color-card);
    border: 0.8px solid var(--color-border);
    border-top: none;
    border-radius: 0 0 8px 8px;
    padding: 12px;
  }

  .category-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .category-option {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 4px 0;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 12px;
    color: var(--color-foreground);
    text-align: left;
  }

  .checkbox {
    width: 24px;
    height: 24px;
    border-radius: 7px;
    background: var(--color-muted);
    flex-shrink: 0;
    transition: background 0.15s;
  }

  .checkbox.checked {
    background: var(--color-primary);
  }

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

  .rules-textarea {
    width: 100%;
    height: 62px;
    padding: 8px 12px;
    border: 0.8px solid var(--color-border);
    border-radius: 8px;
    font-size: 12px;
    color: var(--color-foreground);
    background: var(--color-card);
    resize: none;
    outline: none;
    font-family: inherit;
  }

  .rules-textarea::placeholder {
    color: var(--color-muted-foreground);
  }

  .rules-textarea:focus {
    border-color: var(--color-ring);
  }

  .similarity-options {
    display: flex;
    gap: 8px;
  }

</style>
