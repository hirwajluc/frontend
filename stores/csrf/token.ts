import { defineStore } from "pinia";
import { httpRequest } from "~/services";

export const useCheckServiceStore = defineStore("checkServiceStore", () => {
  const loading = ref(false);
  const setLoading = (data: boolean) => (loading.value = data);

  const checkServiceStatus = async () => {
    setLoading(true);
    await httpRequest.get("/api/v1/service-status").finally(() => {
      setLoading(false);
    });
  };
  return {
    loading,
    setLoading,
    checkServiceStatus,
  };
});
