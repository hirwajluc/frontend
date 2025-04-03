<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps({
  error: Object as () => NuxtError,
});

const handleError = () => clearError({ redirect: "/" });
</script>

<template>
  <NuxtLayout name="default">
    <UContainer class="gap-4">
      <div class="gap-4 flex justify-around rounded-lg py-4">
        <div class="flex flex-col items-center justify-center py-12">
          <h1 class="text-8xl font-semibold py-6 text-primary-500">
            {{ error.statusCode }}
          </h1>
          <div class="text-2xl py-3 text-center">{{ error.message }}</div>

          <p
            class="text-slate-600 font-normal pa-3"
            v-if="error.statusCode === 404"
          >
            Sorry, the page you are looking for does not exist.
          </p>
          <p v-else>Something went wrong.</p>
          <UButton variant="ghost" class="mt-5" @click="handleError"
            >Clear errors</UButton
          >
        </div>
        <div class="flex flex-col py-6 items-center lg:h-full">
          <img
            src="@/assets/svg/404.svg"
            class="h-[450px] w-auto mx-auto my-auto items-center justify-center"
          />
        </div>
      </div>
    </UContainer>
  </NuxtLayout>
</template>
