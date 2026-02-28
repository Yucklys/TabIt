<script lang="ts">
  import { Settings } from "@lucide/svelte";
  import { navigate, Route } from "$lib/router.svelte";
  import { t } from "$lib/i18n.svelte";

  // Default to aggressive mode
  export const defaultMode = "aggressive";
</script>

<div class="flex items-center justify-between mb-6">
  <div class="flex items-center gap-3">
    <!-- Tabit logo -->
    <div class="relative w-[19px] h-[19px]">
      <div
        class="absolute bg-[#ff4f4f] w-[9px] h-[7px] rounded-[2px] top-[12px] left-[10px]"
      ></div>
      <div
        class="absolute bg-[#ffab04] w-[9px] h-[12px] rounded-[2px] top-[7px] left-0"
      ></div>
      <div
        class="absolute bg-[#0486ff] w-[9px] h-[11px] rounded-[2px] top-0 left-[10px]"
      ></div>
      <div
        class="absolute bg-[#03b151] w-[9px] h-[5px] rounded-[2px] top-0 left-0"
      ></div>
    </div>
    <h1>TabIt</h1>
  </div>

  <button class="settings-icon" aria-label={t('header.settings_aria')} onclick={() => navigate(Route.Settings)}>
    <Settings size={20} />
  </button>
</div>

<style>
  .settings-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    background: transparent;
    color: #9ca3af;
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.2s;
  }

  .settings-icon:hover {
    background: #f3f4f6;
    color: #6b7280;
  }
</style>
