<template>
  <div
    class="lg:px-24 max-sm:px-2 max-sm:py-8 col-span-1 space-y-6 flex flex-col items-center justify-start py-24"
  >
    >
    <AuthHeading
      title="Change Password"
      subtitle="Please enter a New Password you will remember. make sure to set a strong password."
    />
    <form @submit.prevent="onSubmit" class="w-full px-16 max-sm:px-2 space-y-4">
      <div class="flex flex-col gap-1">
        <label for="password"> New Password</label>
        <InputGroup class="my-0">
          <Password
            v-model="formState.password"
            toggleMask
            class="h-12"
            :invalid="errors.password"
          >
            <template #header>
              <div class="font-semibold text-xm mb-1">Set a password</div>
            </template>
            <template #footer>
              <ul class="space-y-1 ml-2 mt-2 border-t py-2 leading-normal">
                <li class="text-sm">At least one lowercase</li>
                <li class="text-sm">At least one uppercase</li>
                <li class="text-sm">At least one numeric</li>
                <li class="text-sm">Minimum 8 characters</li>
              </ul>
            </template>
          </Password>
        </InputGroup>
      </div>
      <div class="flex flex-col gap-1">
        <label for="password">Confirm Password</label>
        <InputGroup class="my-0">
          <Password
            v-model="formState.confirmPassword"
            toggleMask
            class="h-12"
            :feedback="false"
            :invalid="errors.confirmPassword"
          />
        </InputGroup>
        <small class="text-red-500" v-if="errors.confirmPassword">
          {{ errors.confirmPassword }}</small
        >
      </div>

      <Button
        class="w-full"
        type="submit"
        size="large"
        label="Set Password"
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
import * as Yup from "yup";
import { object, string } from "yup";
import type { PasswordType } from "~/types";
const route = useRoute();
const resetKey = computed(() => {
  return route.query.reset_key as string;
});
const authStore = useAuthStore();
const formState = reactive<PasswordType>({
  password: "",
  reset_key: resetKey.value,
});
// Error state
const errors = reactive({
  confirmPassword: null,
  password: null,
});

// Yup validation schema
const schemaPassword = object({
  password: string()
    .min(8, "Must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: string().when("password", (password, field) =>
    password
      ? field
          .required("Confirm password is required")
          .oneOf([Yup.ref("password")], "Please make your passwords match")
      : field
  ),
});

const loading = computed(() => {
  return authStore.loading;
});
const onSubmit = async () => {
  try {
    // Reset errors
    errors.confirmPassword = null;
    errors.password = null;

    // Validate the form state using Yup
    await schemaPassword.validate(formState, { abortEarly: false });

    // If validation passes, call login action from the auth store
    await authStore.setPassword(formState);
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
      await schemaPassword.validate(newState, { abortEarly: false });

      // Clear errors if validation passes
      errors.confirmPassword = null;
      errors.password = null;
    } catch (validationError) {
      // Handle validation errors
      errors.confirmPassword = null;
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
