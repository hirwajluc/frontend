import { defineStore } from "pinia";
import { httpRequest } from "~/services";
import type { MenuData } from "~/types/layout/sidebar.type";

export const useSidebarStore = defineStore("sidebarStore", () => {
  const menus = ref<MenuData[]>();
  const activeLink = ref();

  const loading = ref(false);
  const setLoading = (data: boolean) => (loading.value = data);
  const setMenus = (data: MenuData[]) => (menus.value = data);
  const setActiveLink = (data?: string) => (activeLink.value = data);


  return {
    menus,
    activeLink,
    loading,
    setLoading,
    setMenus,
    setActiveLink,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSidebarStore, import.meta.hot));
}
