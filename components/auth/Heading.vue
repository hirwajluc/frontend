<template>
  <div class="flex flex-col items-center justify-center text-center gap-y-2">
     <img src="assets/images/bralirwa-logo.png" /> 
    <div class="px-16 max-sm:px-2   flex flex-col space-y-3 py-6">
      <div class="text-3xl font-bold text-primary">{{ props.title }}</div>
      <small class="text-gray-500"
        >{{  props.subtitle }}</small
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  title: string;
  subtitle: string;
}>();
</script>

<style></style>
