export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore();
  if (!authStore.user) {
    return await navigateTo("/auth/login");
  }
  // Redirect to change password if account is new and not already on the change password page
  if (
    authStore.user.force_change_password &&
    to.path !== "/settings/change_password"
  ) {
    return navigateTo("/settings/change_password");
  }
  
  // Check if user can view logs; if not, prevent access to `/dashboard/view-logs`
  if (to.path === "/settings/activity-logs" && !authStore.user.can_view_logs) {
    return navigateTo("/dashboard"); // Redirect to dashboard or another appropriate page
  }
 
});
