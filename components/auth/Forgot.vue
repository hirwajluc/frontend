<template>
  <div
    class="px-24 max-sm:px-6 max-sm:py-8 col-span-1 space-y-6 flex flex-col items-center justify-start py-24"
  >
    <AuthHeading
      title="Forgot Password"
      subtitle="Please enter your work email, a reset link will be sent to your inbox."
    />
    <form @submit.prevent="onSubmit" class="w-full px-16 max-sm:px-2 space-y-4">
      <div class="flex flex-col gap-1">
        <label for="username">Email</label>
        <InputText
          v-model="formState.email"
          :invalid="errors.email"
          size="large"
          class="w-full"
        />
      </div>

      <Button
        class="w-full"
        type="submit"
        size="large"
        label="Submit"
        icon="pi pi-check"
        iconPos="right"
        :loading="loading"
        :disabled="loading"
      />
    </form>
    <div class="flex items-center justify-center space-x-1">
      <div
        class="font-medium text-gray-400 text-center cursor-pointer hover:text-primary duration-300"
      >
        Remember your password?
      </div>
      <Button
        as="router-link"
        label="Back Login"
        to="/auth/login"
        link
        class="font-semibold"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Login } from "~/types";
import { object, string } from "yup";

const authStore = useAuthStore();
const formState = reactive({
  email: "",
});
// Error state
const errors = reactive({
  email: null,
});

const loginSchema = object({
  email: string().email("Invalid email").required("Email is required"),
});

const loading = computed(() => {
  return authStore.loading;
});
const onSubmit = async () => {
  try {
    // Reset errors
    errors.email = null;

    // Validate the form state using Yup
    await loginSchema.validate(formState, { abortEarly: false });

    // If validation passes, call login action from the auth store
    await authStore.requestResetPassword(formState);
  } catch (validationError) {
    // Handle validation errors
    validationError.inner.forEach((error: any) => {
      errors[error.path] = error.message; // Set the error message for the corresponding field
    });
  }
};

// Watcher for real-time validation while typing
watch(
  () => formState,
  async (newState) => {
    try {
      // Validate form in real-time on input changes
      await loginSchema.validate(newState, { abortEarly: false });

      // Clear errors if validation passes
      errors.email = null;
      errors.password = null;
    } catch (validationError) {
      // Handle validation errors
      errors.email = null;
      errors.password = null;

      if (validationError.inner) {
        validationError.inner.forEach((error: any) => {
          errors[error.path] = error.message;
        });
      }
    }
  },
  { deep: true } // Watch the entire object for changes
);
</script>

<style></style>
