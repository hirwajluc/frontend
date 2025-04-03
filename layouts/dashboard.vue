<template>
  <div class="flex relative min-h-screen">
    <LayoutSidebar />
    <div class="flex-1">
      <LayoutHeader />
      <div class=" max-w-7xl mx-auto px-4 py-4 ">
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>


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
