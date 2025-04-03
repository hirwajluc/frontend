<template>
  <NuxtLayout name="auth">
    <div class="grid grid-cols-1 lg:grid-cols-2 h-full">
      <AuthForgot />
      <LayoutRightSide />
    </div>
  </NuxtLayout>

</template>

<script lang="ts" setup>
 import LayoutRightSide from "~/components/auth/LayoutRightSide.vue";
 
definePageMeta({
  title: "Rest Password",
  layout: false,
  middleware: "authenticated",
});
</script>

<style></style>
