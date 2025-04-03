<template>
  <div class="container mx-auto ">
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
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

      <!-- Right Section: Profile Information -->
      <div class="col-span-3 bg-white p-6 rounded-lg ">
        <h2 class="text-xl font-semibold mb-6">My Profile</h2>

        <div class="space-y-6">
          <!-- Personal Information -->
          <section class="p-4  border-2 border-border rounded-xl">
            <h3 class="text-lg font-semibold  text-gray-700 mb-2 flex justify-between">
              Personal Information
              <Button type="button" size="small" text severity="secondary" label="Edit" icon="pi pi-user-edit">

              </Button>
            </h3>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 justify-between items-center">
              <div class="flex flex-col space-y-1 col-span-1">
                <p class="text-sm text-gray-600 font-light">First name </p>
                <div class="text-lg font-medium"> {{ user?.firstname }} </div>
              </div>
              <div class="flex flex-col space-y-1 col-span-1">
                <p class="text-sm text-gray-600 font-light">Last name </p>
                <div class="text-lg font-medium"> {{ user?.lastname }} </div>
              </div>

              <div class="flex flex-col space-y-1 col-span-1">
                <p class="text-sm text-gray-600 font-light">Email address</p>
                <div class="text-lg font-medium"> {{ user?.email }} </div>
              </div>
              <div class="flex flex-col space-y-1 col-span-1">
                <p class="text-sm text-gray-600 font-light">Phone number</p>
                <div class="text-lg font-medium"> {{ user?.phone }} </div>
              </div>

              <div class="flex flex-col space-y-1 col-span-2">
                <p class="text-sm text-gray-600 font-light">Bio </p>
                <div class="text-lg font-medium"> {{ user?.firstname }} </div>
              </div>


            </div>
          </section>

          <!-- Address Information -->
          <section class="p-4  border-2 border-border rounded-xl">
            <h3 class="text-lg font-semibold text-gray-700 mb-2 flex justify-between">
              System Access
              <Button type="button" size="small" text severity="secondary" label="Edit" icon="pi pi-user-edit">

              </Button>
            </h3>
            <div class="grid grid-cols-4 gap-2">
              <small class="border rounded-lg border-border p-2 font-semibold text-lg" v-if="user?.can_add_user">
                <i class="pi pi-check-circle text-lg text-primary mx-2" /> CAN ADD USER
              </small>
              <small class="border rounded-lg border-border p-2 font-semibold text-lg" v-if="user?.can_add_codes">
                <i class="pi pi-check-circle text-lg text-primary mx-2" />  CAN ADD CODES
              </small>
              <small class="border rounded-lg border-border p-2 font-semibold text-lg" v-if="user?.can_view_logs">
                <i class="pi pi-check-circle text-lg text-primary mx-2" />  CAN VIEW LOGS
              </small>
              <small class="border rounded-lg border-border p-2 font-semibold text-lg" v-if="user?.can_trigger_draw">
                <i class="pi pi-check-circle text-lg text-primary mx-2" />  CAN TRIGGER DRAW
              </small>
            </div>
          </section>
          <!-- Address Information -->
          <section class="p-4  border-2 border-border rounded-xl">
            <h3 class="text-lg font-semibold text-gray-700 mb-2 flex justify-between">
              Address infromation
              <Button type="button" size="small" text severity="secondary" label="Edit" icon="pi pi-user-edit">

              </Button>
            </h3>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 justify-between items-center">
              <div class="flex flex-col space-y-1 col-span-1">
                <p class="text-sm text-gray-600 font-light">Country </p>
                <div class="text-lg font-medium"> {{ user?.address.country }} </div>
              </div>
              <div class="flex flex-col space-y-1 col-span-1">
                <p class="text-sm text-gray-600 font-light">City/State </p>
                <div class="text-lg font-medium"> {{ user?.address.province }} </div>
              </div>

              <div class="flex flex-col space-y-1 col-span-1">
                <p class="text-sm text-gray-600 font-light">Distict</p>
                <div class="text-lg font-medium"> {{ user?.address.district }} </div>
              </div>

              <div class="flex flex-col space-y-1 col-span-1">
                <p class="text-sm text-gray-600 font-light">Sector</p>
                <div class="text-lg font-medium"> {{ user?.address.sector }} </div>
              </div>


            </div>
          </section>


        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  title: "User Profile",
  layout: "dashboard",
  middleware: "auth",
});
const home = ref({
  icon: "pi pi-home",
  label: "Home",
  route: "/dashboard",
});
const items = ref([{ label: "Users" }, { label: "Profile" }]);

const userStore = useUserStore();
const user = computed(() => {
  return userStore.user;
});
</script>

<style></style>