<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 h-full">
    <AuthSetPassword /> <LayoutRightSide />
  </div>
</template>

<script lang="ts" setup>
import LayoutRightSide from "~/components/auth/LayoutRightSide.vue";

definePageMeta({
  title: "Set Password",
  layout: "auth",
  middleware: "authenticated",
});
</script>

<style></style>
