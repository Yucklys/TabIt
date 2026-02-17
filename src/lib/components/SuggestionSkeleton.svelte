<script lang="ts">
  import { Skeleton } from "$lib/components/ui/skeleton/index";
</script>

<!-- Tab Groups heading skeleton -->
<div class="mb-4 shrink-0">
  <Skeleton class="h-5 w-28 mb-1" />
  <Skeleton class="h-3 w-24" />
</div>

<!-- Group rows skeleton -->
<div class="flex-1 min-h-0 space-y-4 pr-4">
  {#each Array(3) as _}
    <div class="flex items-center gap-3 p-3 rounded-xl border border-[#e5e7eb]">
      <Skeleton class="w-8 h-8 rounded-lg shrink-0" />
      <Skeleton class="h-4 flex-1" />
      <Skeleton class="h-6 w-10 rounded-lg" />
      <Skeleton class="w-4 h-4 rounded" />
    </div>
  {/each}
</div>
