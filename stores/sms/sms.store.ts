import { defineStore } from "pinia";
import { httpRequest } from "~/services";

export const useMessageStore = defineStore("messageStore", () => {
  const messages = ref([]);
  const balance = ref(0);
  const loading = ref(false);
  const resending = ref(false);
  const setMessages = (data?: any) => (messages.value = data);
  const setBalance = (data?: any) => (balance.value = data);
  const setLoading = (value: boolean) => (loading.value = value);
  const setResending = (value: boolean) => (resending.value = value);
  const alert = useAlertStore();
   const pagination = ref({
     limit: 10, // Default per page, or set from API response
     page: 0, // Current page (0-indexed for Vue pagination)
     total: 0, // Total records from API response
   });
   const setPagination = (data: any) => (pagination.value = data);


  const GetMessages = async (
    page?: any,
    limit?: any,
    start_date?: any,
    end_date?: any,
    message_type?: any
  ) => {
    setLoading(true);
    // Build query parameters only if dates are provided
    const params = [];
    if (start_date) params.push(`start_date=${start_date}`);
    if (end_date) params.push(`end_date=${end_date}`);
    if (page) params.push(`page=${page}`);
    if (limit) params.push(`limit=${limit}`);
    if (message_type) params.push(`message_type=${message_type}`);

    const query = params.length ? `?${params.join("&")}` : "";
    await httpRequest
      .get(`/api/v1/sms_sent${query}`)
      .then((res) => {
        setMessages(res.data);
        setPagination(res.pagination);
      })
      .catch((error) => {
        setMessages();
      })
      .finally(() => {
        setLoading(false);
      });
  }; 
  const GetMessageBalance = async () => {
    setLoading(true);
    await httpRequest
      .get("/api/v1/sms_balance")
      .then((res) => {
        setBalance(res.balance);
      })
      .catch((error) => {
        setBalance();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const resendMessage = async (smsId: any) => {
    setResending(true);
    await httpRequest
      .post(`/api/v1/resend_sms/${smsId}`)
      .then((res) => {
        if (res.status == 200) {
          alert.success(res.message);
          GetMessages();
        }
      })
      .catch((error) => {
        alert.error(error.message);
      })
      .finally(() => {
        setResending(false);
      });
  };
  return {
    loading,
    messages,
    balance,
    GetMessageBalance,
    GetMessages,
    setLoading,
    setMessages,
    setBalance,
    pagination,
    setPagination,
    resendMessage,
    resending,
    setResending,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
