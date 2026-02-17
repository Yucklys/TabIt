<script lang="ts">
  import './app.css';
  import SuggestionPage from './routes/suggestion/+page.svelte';
  import CustomizePage from './routes/customize/+page.svelte';
  import { getRoute, Route } from '$lib/router.svelte';
</script>

<main>
  {#if getRoute() === Route.Suggestion}
    <SuggestionPage />
  {:else if getRoute() === Route.Customize}
    <CustomizePage />
  {/if}
</main>
