<script lang="ts" setup>
import { menuDataItems, menuSettingDataItems } from "~/constants/menu";
import { useMainStore, useSidebarStore } from "~/stores";


const sidebarStore = useSidebarStore();
const mainStore = useMainStore();
const authStore = useAuthStore();
const sDrawer = ref(true);
const openSubmenu = ref(false);
const search = ref("");
const route = useRoute().params;
const showSidebar = computed(() => {
  return mainStore.showSidebar;
});



const selectedMenu = computed(() => {
  return mainStore.activeMenu;
});

const isAccountNew = computed(() => {
  return authStore.user.force_change_password || false;
});

const selectedSubmenu = computed(() => {
  return mainStore.activeSubMenu;
});
function activeLink(title: any, submenu: boolean) {
  if (submenu) {
    openSubmenu.value = true;
  }
  mainStore.setActiveMenu(title);
}

function activeSubLink(title: any) {
  mainStore.setActiveSubMenu(title);
  mainStore.setShowSidebar(false);
}
const menuItems = ref(menuDataItems);
const menuSettingItems = ref(menuSettingDataItems);

// Computed property to filter menu items based on user roles
const filteredMenuItems = computed(() => {
  return menuDataItems;
});

// Computed property to filter menu items based on user roles
const filteredSettingMenuItems = computed(() => {
  return menuSettingDataItems.filter(item => {
    // Example logic to filter menu items based on user permissions using URLs
    switch (item.url) {
       
      case '/settings/activity-logs':
        return authStore.user.can_view_logs;
      default:
        return true; // Show all other items by default
    }
  });
});
</script>

<style></style>

<template>
  <div :class="[{ 'sidebar-blur select-none': isAccountNew }, { 'relative translate-x-0': showSidebar }]"
    class="h-lvh self-start lg:sticky top-0 absolute inset-y-0 left-0 transform -translate-x-full transition duration-200 ease-in-out md:relative md:-translate-x-0 flex min-h-full w-full max-w-72 flex-col dark:bg-gray-950 bg-white bg-clip-border p-4 text-gray-700 shadow-lg shadow-blue-gray-900/5">
    <div class="flex items-center gap-4 py-4 rounded-lg mb-2">
      <img src="/assets/images/bralirwa-logo.png" class="rounded-lg" />
    </div>

    <nav class="flex min-w-[240px] flex-col justify-between h-full py-2 text-base font-semibold">
      <div>
        <div v-for="(item, i) in filteredMenuItems" :key="i" @click="activeLink(item.title, item.expanded)"
          class="relative block w-full my-1">
          <!-- menu -->
          <nuxt-link :to="!item.expanded ? item.url : '#'" :class="item.title == selectedMenu ? 'bg-[#054a29]' : ' '"
            class="flex items-center w-full p-0 leading-tight transition-all rounded-lg outline-none text-start hover:bg-primary hover:text-white duration-300">
            <div class="flex items-center justify-between w-full p-2.5 text-base">
              <i v-bind:class="item.icon" :class="item.title == selectedMenu ? `text-white` : `` + ``" class="mr-2"
                style="font-size: 1.2rem"></i>

              <p class="block mr-auto text-sm antialiased leading-relaxed"
                :class="item.title == selectedMenu ? 'text-white ' : ' '">
                {{ item.title }}
              </p>
              <span class="pi pi-chevron-down ml-4" :class="openSubmenu && item.title == selectedMenu
                ? 'rotate-180 text-white'
                : ''
                " v-if="item.expanded">
              </span>
            </div>
          </nuxt-link>
          <!-- submenu -->
          <div v-if="item.expanded && openSubmenu && item.title == selectedMenu" class="overflow-hidden">
            <div class="block w-full py-1 text-sm antialiased font-light leading-normal text-gray-700">
              <nav class="flex min-w-[240px] flex-col gap-1 p-0   font-medium text-blue-gray-700">
                <nuxt-link v-for="(sub, i) in item.submenu" :key="i" @click="activeSubLink(sub.title)" :to="sub.url"
                  :class="selectedSubmenu == sub.title ? 'bg-green-100/70 text-primary' : ''"
                  class="flex items-center w-full p-3 group hover:bg-green-100/70 duration-300   transition-all rounded-lg outline-none hover:text-primary">
                  <div :class="selectedSubmenu == sub.title ? 'bg-emerald-900' : ''"
                    class="grid h-2 w-2 group-hover:bg-primary transition-all duration-300 text-xs rounded-full mx-3 place-items-center">
                  </div>
                  {{ sub.title }}
                </nuxt-link>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div>

        <div v-for="(item, i) in filteredSettingMenuItems" :key="i" @click="activeLink(item.title, item.expanded)"
          class="relative block w-full my-1">
          <!-- menu -->
          <nuxt-link :to="!item.expanded ? item.url : '#'" :class="item.title == selectedMenu ? 'bg-[#054a29]' : ' '"
            class="flex items-center w-full p-0 leading-tight transition-all rounded-lg outline-none text-start hover:bg-primary hover:text-white duration-300">
            <div class="flex items-center justify-between w-full p-2.5 text-base">
              <i v-bind:class="item.icon" :class="item.title == selectedMenu ? `text-white` : `` + ``" class="mr-2"
                style="font-size: 1.2rem"></i>

              <p class="block mr-auto text-sm antialiased leading-relaxed"
                :class="item.title == selectedMenu ? 'text-white ' : ' '">
                {{ item.title }}
              </p>
              <span class="pi pi-chevron-down ml-4" :class="openSubmenu && item.title == selectedMenu
                ? 'rotate-180 text-white'
                : ''
                " v-if="item.expanded">
              </span>
            </div>
          </nuxt-link>

        </div>
      </div>


    </nav>
  </div>
</template>
<style scoped>
.sidebar-blur {
  pointer-events: none;
  filter: blur(4px);
  opacity: 0.7;
}
</style>