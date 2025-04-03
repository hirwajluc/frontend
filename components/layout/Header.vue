<template>
  <div class="flex items-center sticky z-10 ml-1 bg-white top-0 justify-between px-4   py-6">

    <div class="">
      <div class="block lg:hidden">

        <Button icon="pi pi-bars" v-if="!showSidebar" @click="mainStore.setShowSidebar(true)" severity="secondary"
          rounded text aria-label="Bookmark" />
        <Button icon="pi pi-times" v-if="showSidebar" @click="mainStore.setShowSidebar(false)" severity="secondary"
          rounded text aria-label="Bookmark" />

      </div>
    </div>



    <div class="flex items-center gap-x-6">
      <div class="flex gap-x-3 hidden">
  
        <Button @click="toggleBalance" @mouseover="toggleBalance" @mouseleave="toggleBalance" severity="secondary" outlined
          class="!border-2">
          <div class="flex items-center space-x-2">
            <img src="/assets/images/sms-con.png"
              class="h-10 cursor-pointer hover:bg-gray-100 bg-card rounded-full p-1" />
            <div class="flex flex-col max-sm:hidden justify-start items-start mr-3">
              <div class="font-light text-xs">Balance</div>

              <div class="font-semibold text-primary uppercase text-md">{{ balance + " SMS" }}</div>
            </div>

          </div>
        </Button>
        <Popover ref="opBalance">
          <nuxt-link to="https://swiftqom.io" target="_blank"
            class="flex gap-4 cursor-pointer group  transition-all duration-300 rounded-lg  ">
            <img src="/assets/images/swift.png"
              class="h-10 w-10 cursor-pointer group-hover:bg-gray-100 bg-card rounded-lg p-1" />
            <div>
              <span
                class="font-medium text-sm block group-hover:text-emerald-500  transition-all duration-300">Powered by SwiftQom</span>
              <small class="font-light text-xs text-gray-400">Streamline Your Bulk Communication</small>
            </div>
          </nuxt-link>
        </Popover>
      </div>
      <div class="h-11 rounded-xl w-1 bg-gray-200"></div>
      <Button @click="toggle" severity="secondary" text class="!border-2">
        <div class="flex items-center space-x-2">
          <Avatar :image="user.avatar_url ?? `https://avatar.iran.liara.run/public`" class="mr-2" shape="circle" />
          <div class="flex flex-col max-sm:hidden justify-start items-start mr-3">
            <div class="font-semibold text-sm">{{ fullname }}</div>
            <div class="font-light text-xs">{{ user.email }}</div>
          </div>

          <i class="pi pi-chevron-down pl-4"></i>
        </div>
      </Button>
      <Popover ref="op">
        <div class="flex flex-col gap-4  ">

          <div>
            <span class="font-light text-sm block mb-2">Account Quick Action</span>
            <div class="list-none p-0 m-0 flex flex-col gap-1">
              <nuxt-link v-for="(menu, i) in settingMenu" :key="i"
                class="flex items-center gap-2 hover:bg-slate-50 text-xs cursor-pointer py-2 px-3 rounded-lg"
                :to="menu.url">
                <i :class="menu.icon" style="font-size: 15px" />
                <div>
                  <span class="font-medium">{{ menu.title }}</span>

                </div>

              </nuxt-link>
              <div class="flex items-center gap-2 grouptext-sm cursor-pointer py-2 px-3 rounded-lg"
                @click="authStore.logout()">
                <i :class="`pi pi-sign-out text-red-500`" style="font-size: 15px" />
                <div>
                  <span class=" text-xs group-hover:font-bold  text-red-500">Sign Out</span>

                </div>

              </div>
            </div>
          </div>
        </div>
      </Popover>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useMessageStore } from '~/stores/sms/sms.store';

const authStore = useAuthStore();
const messageStore = useMessageStore()
const mainStore = useMainStore();
const user = computed(() => {
  return authStore.user;
});
const balance = computed(() => {
  return messageStore.balance;
})
const fullname = computed(() => {
  return user.value.firstname + " " + user.value.lastname || "User";
});

const op = ref();
const opBalance = ref();
const settingMenu = ref([
  {
    title: "Account Profile",
    url: "/settings/account",
    icon: "pi pi-user",
  },
  {
    title: "Change Password",
    url: "/settings/change_password",
    icon: "pi pi-lock",
  },

]);
const showSidebar = computed(() => {
  return mainStore.showSidebar;
});

const toggle = (event: any) => {
  op.value.toggle(event);
};
const toggleBalance = (event: any) => {
  console.log("toggle");

  opBalance.value.toggle(event);
};

</script>

<style></style>
