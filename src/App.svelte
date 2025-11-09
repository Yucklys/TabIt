<script lang="ts">
  import './app.css';
  import SuggestionPage from './routes/suggestion/+page.svelte';

  // Simple routing for Chrome extension
  let currentRoute = $state('suggestion');

  function navigate(route: string) {
    currentRoute = route;
  }
</script>

<main>
  {#if currentRoute === 'suggestion'}
    <SuggestionPage />
  {:else}
    <!-- Default/home route -->
    <div class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <h1 class="text-2xl font-bold mb-4">Tabit</h1>
        <button 
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onclick={() => navigate('suggestion')}
        >
          Go to Suggestions
        </button>
      </div>
    </div>
  {/if}
</main>
