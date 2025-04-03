<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 h-full">
    <Login /> <LayoutRightSide />
  </div>
</template>

<script lang="ts" setup>
import LayoutRightSide from "~/components/auth/LayoutRightSide.vue";
import Login from "~/components/auth/Login.vue";

definePageMeta({
  title: "Login",
  layout: "auth",
  middleware: "authenticated",
});
</script>

<style></style>
