import { defineStore } from "pinia";

import { httpRequest } from "~/services";
import type { Customer, CustomerEntryData, CustomerType } from "~/types";

export const useEntriesStore = defineStore("entriesStore", () => {
  const loading = ref(false);
  const entries = ref([]);
  const provinces = ref([]);
  const customerEntries = ref<CustomerEntryData[]>([]);
  const customer = ref<CustomerType>();
  const customerInfo = ref<Customer>();
  const pagination = ref({
    limit: 10, // Default per page, or set from API response
    page: 0, // Current page (0-indexed for Vue pagination)
    total: 0, // Total records from API response
  });
  const setPagination = (data: any) => (pagination.value = data);
  const setProvinces = (data: any) => (provinces.value = data);
  const setEntries = (data: any) => (entries.value = data);
  const setCustomerEntries = (data: any) => (customerEntries.value = data);
  const setCustomer = (data: any) => (customer.value = data);
  const setCustomerInfo = (data: any) => (customerInfo.value = data);
  const setLoading = (data: boolean) => (loading.value = data);

  const getAllEntries = async (
    page?: any,
    limit?: any,
    start_date?: any,
    end_date?: any,
    province_id?: any,
    network_operator?: any
  ) => {
    setLoading(true);
    // Build query parameters only if dates are provided
    const params = [];
    if (province_id) params.push(`province_id=${province_id}`);
    if (start_date) params.push(`start_date=${start_date}`);
    if (end_date) params.push(`end_date=${end_date}`);
    if (page) params.push(`page=${page}`);
    if (limit) params.push(`limit=${limit}`);
    if (network_operator) params.push(`network_operator=${network_operator}`);

    const query = params.length ? `?${params.join("&")}` : "";
     await httpRequest
      .get(`/api/v1/entries${query}`)
      .then((res) => {
        setEntries(res.data);
        setPagination(res.pagination);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getAllProvinces = async () => {
    setLoading(true);
    await httpRequest
      .get(`/api/v1/provinces`)
      .then((res) => {
        setProvinces(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getCustomerInfo = async (customerId: any) => {
    setLoading(true);
    await httpRequest
      .get(`/api/v1/customer/${customerId}`)
      .then((res) => {
        setCustomerInfo(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };


  const getCustomeEntry = async (entryId: any) => {
    setLoading(true);
    await httpRequest
      .get(`/api/v1/entry/${entryId}`)
      .then((res) => {
        setCustomer(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return {
    loading,
    setLoading,
    getAllEntries,
    entries,
    customerInfo,
    setEntries,
    setCustomerEntries,
    customerEntries,
    getAllProvinces,
    getCustomerInfo,
    customer,
    setCustomer,
    pagination,
    setPagination,
    provinces,
    setProvinces,
    getCustomeEntry,
  };
});
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useEntriesStore, import.meta.hot));
}
