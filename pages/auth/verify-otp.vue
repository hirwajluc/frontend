<template>
  <NuxtLayout name="auth">
    <div class="grid grid-cols-1 lg:grid-cols-2 h-full">
      <Otp />
      <LayoutRightSide />
    </div>
  </NuxtLayout>

</template>

<script lang="ts" setup>
import LayoutRightSide from "~/components/auth/LayoutRightSide.vue";
import Otp from "~/components/auth/Otp.vue";

definePageMeta({
  title: "OTP",
  layout: false,
  middleware: "authenticated",
});
</script>

<style></style>
