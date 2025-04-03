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
    <div class="p-4 surface-card border-round max-w-7xl mx-auto">


      <!-- General Section -->
      <h2 class="text-xl font-bold mb-4">General</h2>
      <div class="mb-4">
        <label for="timezone" class="block text-lg font-medium">Timezone</label>
        <Select v-model="form.timezone" :options="timezones" optionLabel="label" optionValue="value" checkmark
          :highlightOnSelect="false" class="w-full md:w-1/2" />

      </div>
      <div class="text-gray-500 mb-8">12:07:22 PM</div>

      <!-- Security Section -->
      <h2 class="text-xl font-bold mb-4">Security</h2>
      <div class="flex items-center mb-6">
        <Checkbox v-model="form.twoFactorAuth" binary class="mr-2" inputId="twoFactorAuth" />
        <label for="twoFactorAuth" class="font-medium">Enable Two-Factor Authentication</label>
      </div>
      <div class="mb-4">
        <label for="phoneNumber" class="block text-lg font-medium">Phone Number</label>
        <InputText v-model="form.phoneNumber" id="phoneNumber" placeholder="+250 788 123 456" class="w-full md:w-1/2" />
        <small class="block text-gray-500 mt-2">
          Please enter an active phone number where you can receive OTP codes via SMS.
        </small>
      </div>
      <div class="mb-8">
        <label for="timeoutSession" class="block text-lg font-medium">Timeout Session</label>

        <Select v-model="form.timeoutSession" :options="timeoutOptions" optionLabel="label" optionValue="value"
          checkmark :highlightOnSelect="false" class="w-full md:w-1/2" />

        <small class="block text-gray-500 mt-2">
          Set the automatic logout time for inactive admin sessions.
        </small>
      </div>

      <!-- Notification and Alerts Section -->
      <h2 class="text-xl font-bold mb-4">Notification and Alerts</h2>
      <div class="mb-4">
        <Checkbox v-model="form.newUserRegistration" binary inputId="newUserRegistration" class="mr-2" />
        <label for="newUserRegistration" class="font-medium">New User Registration</label>
      </div>
      <div class="mb-4">
        <Checkbox v-model="form.systemErrors" binary inputId="systemErrors" class="mr-2" />
        <label for="systemErrors" class="font-medium">System Errors</label>
      </div>
      <div class="mb-4">
        <Checkbox v-model="form.prizeDrawsTriggered" binary inputId="prizeDrawsTriggered" class="mr-2" />
        <label for="prizeDrawsTriggered" class="font-medium">Prize Draws Triggered</label>
      </div>
    </div>
  </div>

</template>

<script setup>
import { ref } from 'vue';
definePageMeta({
  title: "Seetings",
  layout: "dashboard",
  middleware: "auth",
});
const home = ref({
  icon: "pi pi-home",
  label: "Home",
  route: "/dashboard",
});
const items = ref([{ label: "System Settings" }]);


const form = ref({
  timezone: 'Kigali',
  twoFactorAuth: false,
  phoneNumber: '',
  timeoutSession: '10',
  newUserRegistration: true,
  systemErrors: true,
  prizeDrawsTriggered: false,
});

const timezones = [
  { label: '+2 Kigali Time', value: 'Kigali' },
  { label: 'UTC', value: 'UTC' },
  { label: 'GMT', value: 'GMT' },
];

const timeoutOptions = [
  { label: '5 Minutes', value: '5' },
  { label: '10 Minutes', value: '10' },
  { label: '30 Minutes', value: '30' },
];
</script>

<style scoped>
/* Add any custom styles if needed */
</style>
