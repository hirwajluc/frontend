<template>
  <div class="flex flex-col h-svh">
    <slot />

  </div>
</template>

<script lang="ts" setup>
import { useCheckServiceStore } from '@/stores'
const title = ref("BRALIRWA Lottery");
useHead({
  meta: [{ content: title }],
  titleTemplate: (titleChunk) => {
    return titleChunk
      ? `${titleChunk} - BRALIRWA Lottery`
      : "BRALIRWA Lottery";
  },
});
</script>

<style></style>