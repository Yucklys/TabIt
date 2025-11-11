<script lang="ts">
  import { cn } from "$lib/utils";

  interface Props {
    class?: string;
    mode?: string;
  }
  
  let { 
    class: className = "",
    mode = "Smart"
  }: Props = $props();

  // Image assets from Figma
  const imgVector = "https://www.figma.com/api/mcp/asset/7dc238cb-08b9-4ef0-8281-f9882d7b6d86";
</script>

<div class={cn("flex items-center justify-between", className)}>
  <div class="flex items-center gap-3">
    <!-- Tabit logo -->
    <div class="relative w-[19px] h-[19px]">
      <div class="absolute bg-[#ff4f4f] w-[9px] h-[7px] rounded-[2px] top-[12px] left-[10px]"></div>
      <div class="absolute bg-[#ffab04] w-[9px] h-[12px] rounded-[2px] top-[7px] left-0"></div>
      <div class="absolute bg-[#0486ff] w-[9px] h-[11px] rounded-[2px] top-0 left-[10px]"></div>
      <div class="absolute bg-[#03b151] w-[9px] h-[5px] rounded-[2px] top-0 left-0"></div>
    </div>
    <h1 class="text-[16px] text-black">TabIt</h1>
  </div>
  
  <!-- Mode selector -->
  <div class="bg-[#f3f3f5] flex items-center gap-[10px] px-[7px] py-1 rounded-[12px]">
    <span class="text-[14px] text-[#717182]">Mode: {mode}</span>
    <div class="relative size-[24px]">
      <div class="absolute inset-[41.67%_29.17%_37.5%_29.17%]">
        <img alt="" class="block max-w-none size-full" src={imgVector} />
      </div>
    </div>
  </div>
</div>