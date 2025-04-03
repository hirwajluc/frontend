export default defineNuxtRouteMiddleware( async  (to, from) => {
  const authStore = useAuthStore();
  if (!!authStore.token) {
    // Redirect to change password page if account is new
    if (authStore.user.force_change_password) {
      return navigateTo(`/settings/change_password`);
    }
    return await navigateTo(`/dashboard`);
  }
});
