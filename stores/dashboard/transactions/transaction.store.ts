import { defineStore } from 'pinia'
import { httpRequest } from '~/services';
import type { TransactionData } from '~/types';

export const useTransactionStore = defineStore("transactionStore", () => {
  const loading = ref(false);
  const isApproving = ref(true);
  const isBulk = ref(false);
  const isFailed = ref(false);

  const loadingData = ref(false);
  const transactionIds = ref();
  const transactions = ref<TransactionData[]>([]);
  const setTransactions = (data: TransactionData[]) => (transactions.value = data);
  const setLoading = (data: boolean) => (loading.value = data);
  const setLoadingData = (data: boolean) => (loadingData.value = data);
  const transaction = ref<TransactionData>();
  const setTransaction = (data: TransactionData) => (transaction.value = data);
  const setFailed = (data: boolean) => (isFailed.value = data);

  const pagination = ref({
    limit: 10, // Default per page, or set from API response
    page: 0, // Current page (0-indexed for Vue pagination)
    total: 0, // Total records from API response
  });
  const setPagination = (data: any) => (pagination.value = data);
  const setTransactionIds = (data?: any) => (transactionIds.value = data);
  const setApproving = (data: boolean) => (isApproving.value = data);
  const setBulk = (data: boolean) => (isBulk.value = data);
  const alert = useAlertStore();
  const mainStore = useMainStore();

  const getAllTransactions = (
    page?: any,
    limit?: any,
    start_date?: any,
    end_date?: any,
    search?: any,
    transaction_type?: any,
    type?: any,
    status?: any,
    exports?: any,
  ) => {
    setLoading(true);
    // Build query parameters only if dates are provided
    const params = [];
    if (start_date) params.push(`start_date=${start_date}`);
    if (end_date) params.push(`end_date=${end_date}`);
    if (page) params.push(`page=${page}`);
    if (limit) params.push(`limit=${limit}`);
    if (search) params.push(`query=${search}`);
    if (transaction_type) params.push(`transaction_type=${transaction_type}`);
    if (status) params.push(`status=${status}`);
    if (type) params.push(type);
    if (exports) params.push(`export=excel`);


    const query = params.length ? `?${params.join("&")}` : "";
    httpRequest
      .get(`/api/v1/transactions${query}`)
      .then((res: any) => {
        if (exports === 'excel') {
          const url = window.URL.createObjectURL(new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'transactions.xlsx');
          document.body.appendChild(link);
          link.click();
          return;
        }
        setTransactions(res.data);
        setPagination(res.pagination);
      })
      .catch((error: any) => {})
      .finally(() => {
        setLoading(false);
      });
  };

  const confirmBulkTransactions = (bulkTrx: any) => {
    setLoadingData(true);
    httpRequest
      .post(`/api/v1/confirm-bulk-trx`, bulkTrx)
      .then((res: any) => {
        alert.success(res.message);
        getAllTransactions();
        setApproving(false)
        mainStore.setApprovalModal(false)
        setTransactionIds()
      })
      .catch((error: any) => {})
      .finally(() => {
        setLoadingData(false);
      });
  };
  const resendBulkTransactions = (bulkTrx: any) => {
    setLoadingData(true);
    httpRequest
      .post(`/api/v1/resend-bulk-trx`, bulkTrx)
      .then((res: any) => {
        alert.success(res.message);
        getAllTransactions();
        setApproving(false)
        mainStore.setApprovalModal(false)
        setTransactionIds()
      })
      .catch((error: any) => { })
      .finally(() => {
        setLoadingData(false);
      });
  };


   const confirmSingleTransactions = (id: any, data: any) => {
     setLoadingData(true);
     httpRequest
       .post(`/api/v1/confirm-trx/${id}`, data)
       .then((res: any) => {
         alert.success(res.message);
         getAllTransactions();
         setApproving(true);
         mainStore.setApprovalModal(false);
       })
       .catch((error: any) => {})
       .finally(() => {
         setLoadingData(false);
       });
   };

  const resendSingleTransactions = (id: any, data: any) => {
    setLoadingData(true);
    httpRequest
      .post(`/api/v1/resend-trx/${id}`, data)
      .then((res: any) => {
        alert.success(res.message);
        getAllTransactions();
        setApproving(true);
        mainStore.setApprovalModal(false);
      })
      .catch((error: any) => { })
      .finally(() => {
        setLoadingData(false);
      });
  };


  const refreshTransaction = (id: any) => {
    setLoading(true);
    httpRequest
     .get(`/api/v1/transactions`)
     .then((res: any) => {
        setTransactions(res.data);
        setPagination(res.pagination);
      })
     .catch((error: any) => {})
     .finally(() => {
        setLoading(false);
      });

  }


  return {
    loading,
    loadingData,
    transactions,
    setTransactions,
    setLoading,
    setLoadingData,
    transaction,
    setTransaction,
    pagination,
    setPagination,
    getAllTransactions,
    transactionIds,
    setTransactionIds,
    confirmBulkTransactions,
    refreshTransaction,
    isApproving,
    isBulk,
    setApproving,
    setBulk,
    confirmSingleTransactions,
    resendBulkTransactions,
    resendSingleTransactions,
    isFailed,
    setFailed
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTransactionStore, import.meta.hot));
}
