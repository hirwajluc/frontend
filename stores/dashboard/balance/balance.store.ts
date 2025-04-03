import { defineStore } from "pinia";
import { httpRequest } from "~/services";

export const useBalanceStore = defineStore("balanceStore", () => {
  const loading = ref(false);
  const setLoading = (data: boolean) => (loading.value = data);
  const alert = useAlertStore()
  const totalBalance = ref({})

   //get balance
  const getBalance = () => {
    setLoading(true);
    httpRequest
      .get("/api/v1/balance")
      .then((res: any) => {
        
      })
      .catch((error: any) => {})
      .finally(() => {
        setLoading(false);
      });
   };

   // top up function
   const topUp = (data: any) => {
    setLoading(true);
    httpRequest
      .post("/api/v1/top-up", data)
      .then((res: any) => {
        if (res.status == 200) {
          alert.success(res.message);
        }
      })
      .catch((error: any) => {})
      .finally(() => {
        setLoading(false);
      });
   };

   return {
    loading,
    setLoading,

   }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useBalanceStore, import.meta.hot));
}
