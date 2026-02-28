<script lang="ts">
  import { onMount } from "svelte";
  import { ChevronLeft } from "@lucide/svelte";
  import { setMode, resetMode, userPrefersMode } from "mode-watcher";
  import * as Card from "$lib/components/ui/card/index";
  import * as ButtonGroup from "$lib/components/ui/button-group/index";
  import { Button } from "$lib/components/ui/button/index";
  import { Label } from "$lib/components/ui/label/index";
  import { navigate, Route } from "$lib/router.svelte";
  import { getLanguage, type Language } from "$api/storage";
  import { t, setUILanguage } from "$lib/i18n.svelte";

  type DisplayMode = "light" | "dark" | "system";

  let currentMode = $derived<DisplayMode>(userPrefersMode.current);
  let language = $state<Language>("en");

  const displayModes: { labelKey: string; value: DisplayMode }[] = [
    { labelKey: "settings.light_mode", value: "light" },
    { labelKey: "settings.dark_mode", value: "dark" },
    { labelKey: "settings.system", value: "system" },
  ];

  const languages: { label: string; value: Language }[] = [
    { label: "English", value: "en" },
    { label: "日本語", value: "ja" },
    { label: "Español", value: "es" },
  ];

  onMount(async () => {
    language = await getLanguage();
  });

  function selectDisplayMode(m: DisplayMode) {
    if (m === "system") {
      resetMode();
    } else {
      setMode(m);
    }
  }

  async function selectLanguage(lang: Language) {
    language = lang;
    await setUILanguage(lang);
  }
</script>

<main>
  <Card.Root class="w-[420px] h-[600px] p-8 flex flex-col gap-3">
    <!-- Back button -->
    <button class="back-button" onclick={() => navigate(Route.Suggestion)}>
      <ChevronLeft size={20} />
      <span>{t('settings.back')}</span>
    </button>

    <div class="flex-1 min-h-0 flex flex-col gap-6 overflow-y-auto mt-2">
      <!-- Display Mode -->
      <div>
        <Label class="text-[14px] text-foreground font-normal mb-2 block">
          {t('settings.display_mode')}
        </Label>
        <div class="mode-previews">
          {#each displayModes as mode (mode.value)}
            <div class="mode-option">
              <button
                class="mode-preview"
                class:selected={currentMode === mode.value}
                onclick={() => selectDisplayMode(mode.value)}
              >
                {#if mode.value === "light"}
                  <div class="preview-window preview-light">
                    <div class="preview-line w-[40px]"></div>
                    <div class="preview-line w-[30px]"></div>
                    <div class="preview-line w-[12px]"></div>
                  </div>
                {:else if mode.value === "dark"}
                  <div class="preview-window preview-dark">
                    <div class="preview-line-dark w-[40px]"></div>
                    <div class="preview-line-dark w-[30px]"></div>
                    <div class="preview-line-dark w-[12px]"></div>
                  </div>
                {:else}
                  <div class="preview-window preview-system">
                    <div class="preview-half-light">
                      <div class="preview-line w-[18px]"></div>
                      <div class="preview-line w-[14px]"></div>
                      <div class="preview-line w-[6px]"></div>
                    </div>
                    <div class="preview-half-dark">
                      <div class="preview-line-dark w-[18px]"></div>
                      <div class="preview-line-dark w-[14px]"></div>
                      <div class="preview-line-dark w-[6px]"></div>
                    </div>
                  </div>
                {/if}
              </button>
              <Button
                variant={currentMode === mode.value ? "default" : "secondary"}
                size="sm"
                onclick={() => selectDisplayMode(mode.value)}
              >
                {t(mode.labelKey)}
              </Button>
            </div>
          {/each}
        </div>
      </div>

      <!-- Language -->
      <div>
        <Label class="text-[14px] text-foreground font-normal mb-2 block">
          {t('settings.language')}
        </Label>
        <ButtonGroup.Root>
          {#each languages as lang (lang.value)}
            <Button
              variant={language === lang.value ? "default" : "secondary"}
              size="sm"
              onclick={() => selectLanguage(lang.value)}
            >
              {lang.label}
            </Button>
          {/each}
        </ButtonGroup.Root>
      </div>
    </div>
  </Card.Root>
</main>

<style>
  .back-button {
    display: flex;
    align-items: center;
    gap: 4px;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--color-muted-foreground);
    font-size: 14px;
    padding: 0;
    line-height: 20px;
  }

  .back-button:hover {
    color: var(--color-foreground);
  }

  .mode-previews {
    display: flex;
    gap: 12px;
  }

  .mode-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    flex: 1;
  }

  .mode-preview {
    width: 100%;
    height: 83px;
    border-radius: 12px;
    background: var(--color-muted);
    overflow: hidden;
    cursor: pointer;
    border: 1.5px solid transparent;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .mode-preview.selected {
    border-color: var(--color-primary);
  }

  .preview-window {
    width: 68px;
    height: 64px;
    border-radius: 0 0 5px 5px;
    box-shadow: 0 0 7.6px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 16px 14px;
  }

  .preview-light {
    background: white;
    border-radius: 9px;
  }

  .preview-dark {
    background: #37383c;
    border-radius: 9px;
  }

  .preview-system {
    display: flex;
    flex-direction: row;
    gap: 0;
    padding: 0;
    border-radius: 9px;
    overflow: hidden;
  }

  .preview-half-light {
    flex: 1;
    background: white;
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 16px 0 16px 8px;
  }

  .preview-half-dark {
    flex: 1;
    background: #37383c;
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 16px 8px 16px 4px;
  }

  .preview-line {
    height: 6px;
    border-radius: 2px;
    background: #ececec;
  }

  .preview-line-dark {
    height: 6px;
    border-radius: 2px;
    background: #4a4b4f;
  }


</style>
