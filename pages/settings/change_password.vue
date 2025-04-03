<template>
  <div>
    <Breadcrumb :home="home" :model="items">
      <template #item="{ item, props }">
        <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
          <a :href="href" v-bind="props.action" @click="navigate" class="flex items-center justify-center">
            <span :class="[item.icon, 'text-color']" />
            <span class="text-primary font-semibold">{{ item.label }}</span>
          </a>
        </router-link>
        <a v-else :href="item.url" :target="item.target" v-bind="props.action">
          <span class="text-surface-700 dark:text-surface-0">{{
            item.label
            }}</span>
        </a>
      </template>
    </Breadcrumb>
    <div class="gap-4 container mx-auto">

      <div class="lg:w-1/3 flex flex-col gap-14 mt-5">
        <div>
          <p class="font-semibold text-xl text-primary">Change Password</p>
          <p class="text-sm font-thin mt-5">Choose a strong, memorable password that you aren't using anywhere else.
            Your
            new password, must
            have at least 8 characters and contain a mix of uppercase, lowercase and non-alphabetic
            characters.</p>
        </div>
        <form @submit.prevent="onSubmit" class="w-full max-sm:px-2 space-y-2">
          <div class="flex flex-col gap-y-1">
            <label for="location" class="font-thin">Current Password</label>
            <InputText v-model="state.current_password" filled :invalid="errors.current_password" />
            <small class="text-red-500" v-if="errors.current_password">
              {{ errors.current_password }}</small>
          </div>
          <div class="flex flex-col gap-1">
            <label for="password"> New Password</label>
            <InputGroup class="my-0">
              <Password v-model="state.new_password" toggleMask class="h-12" :invalid="errors.new_password">
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
            <small class="text-red-500" v-if="errors.new_password">
              {{ errors.new_password }}</small>
          </div>
          <div class="flex flex-col gap-1">
            <label for="password"> Confirm Password</label>
            <InputGroup class="my-0">
              <Password v-model="state.confirm_password" toggleMask :feedback="false" class="h-12"
                :invalid="errors.confirm_password">


              </Password>
            </InputGroup>
            <small class="text-red-500" v-if="errors.confirm_password">
              {{ errors.confirm_password }}</small>
          </div>

          <div class="flex gap-x-4">
            <Button severity="primary" type="submit" :loading="loading">
              <span class="px-4">Change Password</span></Button>
          </div>
        </form>
      </div>
    </div>
  </div>

</template>

<script lang="ts" setup>
import * as Yup from "yup"; // Import Yup
import { object, string } from "yup";
import { httpRequest } from "~/services";

definePageMeta({
  title: "Change password",
  layout: "dashboard",
  middleware: "auth",
});

// Form state
const state = ref({
  current_password: '',
  new_password: '',
  confirm_password: '',
});

const home = ref({
  icon: "pi pi-home",
  label: "Home",
  route: "/dashboard",
});

const items = ref([{ label: "Settings", route: "/settings" }, { label: "Change Password" }]);
const authStore = useAuthStore();
const alert = useAlertStore();

const errors = reactive({
  current_password: null,
  new_password: null,
  confirm_password: null,
});
const loading = ref(false)

// Yup validation schema for password
const schemaPassword = object({
  current_password: string()
    .min(8, "Current Password must be at least 8 characters")
    .required("Current Password is required"),
  new_password: string()
    .min(8, "New Password must be at least 8 characters")
    .matches(/[a-z]/, "At least one lowercase")
    .matches(/[A-Z]/, "At least one uppercase")
    .matches(/\d/, "At least one numeric")
    .required("New Password is required"),
  confirm_password: Yup.string()
    .oneOf([Yup.ref('new_password'), null], "Passwords must match")
    .required("Confirm Password is required"),
});

// Reset error fields
const resetError = () => {
  errors.current_password = null;
  errors.new_password = null;
  errors.confirm_password = null;
};
const changePassword = async (data: any) => {
  loading.value = true;
  await httpRequest
    .post("/api/v1/change_password", data)
    .then((res) => {
      alert.success(res.message);
      state.current_password = "";
      state.new_password = "";
      state.confirm_password = "";
      //wait for 3 seconds
      setTimeout(() => {
        authStore.logout();
      }, 3000);
    })
    .finally(() => {
      loading.value = false;
    });
};

// Submit form handler
const onSubmit = async () => {
  try {
    // Reset errors
    resetError();

    // Validate the form state using Yup
    await schemaPassword.validate(state.value, { abortEarly: false });

    // Call the action to change password in the auth store
    await changePassword(state.value);

    // Optionally, clear the form after successful submission
  } catch (validationError) {
    // Handle validation errors
    if (validationError.inner) {
      validationError.inner.forEach((error: any) => {
        errors[error.path] = error.message; // Set the error message for the corresponding field
      });
    }
  }
};

// Watcher for real-time validation while typing
watch(
  state,
  async (newState) => {
    try {
      // Validate form in real-time on input changes
      await schemaPassword.validate(newState, { abortEarly: false });
      resetError(); // Clear errors if validation passes
    } catch (validationError) {
      // Handle validation errors
      resetError(); // Clear existing errors before setting new ones
      if (validationError.inner) {
        validationError.inner.forEach((error: any) => {
          errors[error.path] = error.message; // Set the validation error message
        });
      }
    }
  },
  { deep: true } // Ensure the watcher is deep for nested objects
);
</script>


<style></style>