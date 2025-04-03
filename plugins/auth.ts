import { useAuthStore } from "@/stores";
export default defineNuxtPlugin(async (nuxtApp) => {
  const authStore = useAuthStore();
  if (!authStore.user) {
    await authStore.checkToken();
  }
});
