<script lang="ts">
  import Header from "$lib/components/Header.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as ButtonGroup from "$lib/components/ui/button-group/index";
  import * as Card from "$lib/components/ui/card/index";
  import { Label } from "$lib/components/ui/label/index";
  import { Slider } from "$lib/components/ui/slider/index";
  import { ChevronDown } from "@lucide/svelte";

  interface Props {
    navigate: (route: string) => void;
  }

  let { navigate }: Props = $props();

  // Category state
  const allCategories = [
    "Social Media",
    "Entertainment",
    "News",
    "Research",
    "Shopping",
    "Documentation",
    "Work",
    "Email",
  ];

  let selectedCategories = $state<string[]>(["Entertainment", "Research", "Work"]);
  let dropdownOpen = $state(false);

  function toggleCategory(category: string) {
    if (selectedCategories.includes(category)) {
      selectedCategories = selectedCategories.filter((c) => c !== category);
    } else {
      selectedCategories = [...selectedCategories, category];
    }
  }

  // Slider state
  let tabCount = $state([2, 8]);
  let similarity = $state<'low' | 'medium' | 'high'>('medium');

  const similarityOptions = [
    { label: 'Low', value: 'low' as const, ratio: 0.3 },
    { label: 'Medium', value: 'medium' as const, ratio: 0.5 },
    { label: 'High', value: 'high' as const, ratio: 0.7 },
  ];

  // Additional rules
  let additionalRules = $state("");
</script>

<main>
  <Card.Root class="w-[420px] h-[600px] p-8 flex flex-col gap-3">
    <Header />

    <div class="flex-1 min-h-0 flex flex-col gap-4 overflow-y-auto">
      <!-- Choose or Enter Categories -->
      <div class="shrink-0">
        <Label class="text-[14px] text-[#0a0a0a] font-normal mb-2 block">
          Choose or Enter Categories:
        </Label>
        <div class="category-selector">
          <button
            class="category-input"
            onclick={() => (dropdownOpen = !dropdownOpen)}
          >
            <div class="tags-row">
              {#each selectedCategories.slice(0, 3) as category (category)}
                <span class="tag">{category}</span>
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
                {#each allCategories as category (category)}
                  <button
                    class="category-option"
                    onclick={() => toggleCategory(category)}
                  >
                    <div
                      class="checkbox"
                      class:checked={selectedCategories.includes(category)}
                    ></div>
                    <span>{category}</span>
                  </button>
                {/each}
              </div>
            </div>
          {/if}
        </div>
      </div>

      <!-- Number of Tabs -->
      <div class="shrink-0">
        <Label class="text-[14px] text-[#0a0a0a] font-normal mb-2 block">
          Number of Tabs per Group
        </Label>
        <div class="slider-container">
          <div class="slider-endpoint">
            <span class="slider-hint">Min</span>
            <span class="slider-label">{tabCount[0]}</span>
          </div>
          <Slider bind:value={tabCount} min={1} max={20} step={1} />
          <div class="slider-endpoint">
            <span class="slider-hint">Max</span>
            <span class="slider-label">{tabCount[1]}</span>
          </div>
        </div>
      </div>

      <!-- Additional Rules -->
      <div class="shrink-0">
        <Label class="text-[14px] text-[#0a0a0a] font-normal mb-2 block">
          Additional Rules (Optional)
        </Label>
        <textarea
          class="rules-textarea"
          placeholder="e.g., Keep social media tabs separate, merge all news sites"
          bind:value={additionalRules}
        ></textarea>
      </div>

      <!-- Grouping Similarity -->
      <div class="shrink-0">
        <Label class="text-[14px] text-[#0a0a0a] font-normal mb-2 block">
          Grouping similarity
        </Label>
        <div class="similarity-options">
          {#each similarityOptions as option (option.value)}
            <button
              class="similarity-option"
              class:active={similarity === option.value}
              onclick={() => (similarity = option.value)}
            >
              <span class="similarity-option-label">{option.label}</span>
              <span class="similarity-option-ratio">{option.ratio}</span>
            </button>
          {/each}
        </div>
      </div>
    </div>

    <!-- Action buttons -->
    <ButtonGroup.Root orientation="vertical" class="w-full shrink-0 mt-4">
      <Button variant="default">Confirm Grouping</Button>
      <Button variant="outline" onclick={() => navigate('suggestion')}>Cancel</Button>
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
    border: 0.8px solid #e5e5e5;
    border-radius: 8px;
    background: white;
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
    background: #4285f4;
    color: white;
    font-size: 12px;
    border-radius: 10px;
    white-space: nowrap;
  }

  .tag-ellipsis {
    font-size: 12px;
    color: #111;
    padding: 0 2px;
  }

  .tag-count {
    min-width: 29px;
    padding: 6px 0;
    text-align: center;
  }

  .category-input :global(.chevron) {
    color: #9ca3af;
    flex-shrink: 0;
  }

  .category-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 10;
    background: white;
    border: 0.8px solid #e5e5e5;
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
    color: #0a0a0a;
    text-align: left;
  }

  .checkbox {
    width: 24px;
    height: 24px;
    border-radius: 7px;
    background: #d9d9d9;
    flex-shrink: 0;
    transition: background 0.15s;
  }

  .checkbox.checked {
    background: #4285f4;
  }

  .slider-container {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 16px 12px;
    border: 1px solid #d9d9d9;
    border-radius: 5px;
    background: white;
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
    color: #9ca3af;
  }

  .slider-label {
    font-size: 14px;
    font-weight: 500;
    color: #060606;
  }

  .rules-textarea {
    width: 100%;
    height: 62px;
    padding: 8px 12px;
    border: 0.8px solid rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    font-size: 12px;
    color: #111;
    resize: none;
    outline: none;
    font-family: inherit;
  }

  .rules-textarea::placeholder {
    color: #717182;
  }

  .rules-textarea:focus {
    border-color: #4285f4;
  }

  .similarity-options {
    display: flex;
    gap: 8px;
  }

  .similarity-option {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 12px 8px;
    border: 1px solid #d9d9d9;
    border-radius: 8px;
    background: white;
    cursor: pointer;
    transition: all 0.15s;
  }

  .similarity-option:hover {
    border-color: #4285f4;
  }

  .similarity-option.active {
    border-color: #4285f4;
    background: #eff6ff;
  }

  .similarity-option-label {
    font-size: 14px;
    font-weight: 500;
    color: #0a0a0a;
  }

  .similarity-option-ratio {
    font-size: 12px;
    color: #9ca3af;
  }
</style>
