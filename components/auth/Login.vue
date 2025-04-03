<template>
  <div
    class="xl:px-24 md:px-20 max-sm:px-6 max-sm:py-8 col-span-1 space-y-6 flex flex-col items-center justify-start py-24"
  >
    <AuthHeading
      title="Lottery System Login"
      subtitle="Welcome to the official administration of the BRALIRWA Lottery
        campaign. Please login with the username and password provided to you by
        your IT administrator."
    />
    <form @submit.prevent="onSubmit" class="w-full lg:px-16 max-sm:px-2 space-y-4">
      <div class="flex flex-col gap-1">
        <label for="username">Email</label>
        <InputText
          v-model="formState.email"
           size="large"
          class="w-full"
        />
        <small class="text-red-500" v-if="errors.email"> {{ errors.email }}</small>
      </div>
      <div class="flex flex-col gap-1">
        <label for="password"> Password</label>
        <InputGroup class="my-0">
          <Password
            v-model="formState.password"
            toggleMask
            class="h-12"
            :feedback="false"
           />
        </InputGroup>
        <small class="text-red-500" v-if="errors.password"> {{ errors.password }}</small>
      </div>
      <div class="lg:flex items-center justify-between">
        <div class="flex items-center">
          <Checkbox
            v-model="formState.rememberMe"
            inputId="ingredient1"
            name="pizza"
            value="remember"
          />
          <label for="rememberMe" class="ml-2"> Remember Me </label>
        </div>
        <Button
          link
          to="/auth/forgot-password"
          as="router-link"
          label="Forgot Password"
          icon="pi pi-question"
          iconPos="right"
        />
      </div>

      <Button
        class="w-full"
        type="submit"
        size="large"
        label="Login"
        icon="pi pi-arrow-right"
        iconPos="right"
        :loading="loading"
        :disabled="loading"
      />
    </form>
    <div
      class="font-semibold text-gray-400 text-center cursor-pointer hover:text-primary duration-300"
    >
      Don’t have an account? Contact your Admin
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Login } from "~/types";
import { object, string, number, date, type InferType, boolean } from "yup";

const authStore = useAuthStore();
const formState = reactive({
  email: "",
  password: "",
  rememberMe: false,
});
// Error state
const errors = reactive({
  email: null,
  password: null,
});

const loginSchema = object({
  email: string().email("Invalid email").required("Email is required"),
  password: string()
    .min(8, "Must be at least 8 characters")
    .required("Password is required"),
 });

const loading = computed(() => {
  return authStore.loading;
});
const onSubmit = async () => {
  try {
    // Reset errors
    errors.email = null;
    errors.password = null;

    // Validate the form state using Yup
    await loginSchema.validate(formState, { abortEarly: false });

    // If validation passes, call login action from the auth store
    await authStore.login(formState);
  } catch (validationError) {
    // Handle validation errors
    validationError.inner.forEach((error: any) => {
      errors[error.path] = error.message; // Set the error message for the corresponding field
    });
  }
};

// Watcher for real-time validation while typing

// watch(
//   () => formState,
//   async (newState) => {
//     try {
//       // Validate form in real-time on input changes
//       await loginSchema.validate(newState, { abortEarly: false });

//       // Clear errors if validation passes
//       errors.email = null;
//       errors.password = null;
//     } catch (validationError) {
//       // Handle validation errors
//       errors.email = null;
//       errors.password = null;

//       if (validationError.inner) {
//         validationError.inner.forEach((error: any) => {
//           errors[error.path] = error.message;
//         });
//       }
//     }
//   },
//   { deep: true } // Watch the entire object for changes
// );
</script>

<style></style>
