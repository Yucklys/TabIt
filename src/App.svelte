<script lang="ts">
  import './app.css';
  import { ModeWatcher } from 'mode-watcher';
  import SuggestionPage from './routes/suggestion/+page.svelte';
  import CustomizePage from './routes/customize/+page.svelte';
  import SettingsPage from './routes/settings/+page.svelte';
  import { getRoute, Route } from '$lib/router.svelte';
</script>

<ModeWatcher />

<main>
  {#if getRoute() === Route.Suggestion}
    <SuggestionPage />
  {:else if getRoute() === Route.Customize}
    <CustomizePage />
  {:else if getRoute() === Route.Settings}
    <SettingsPage />
  {/if}
</main>
