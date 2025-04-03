import { defineStore } from "pinia";

export const useReportStore = defineStore("reportStore", () => {
  const reportTab = ref(1);
  const reports = ref([]);
  const loading = ref(false);
  const setLoading = (data: boolean) => (loading.value = data);
  const setReports = (data: any) => (reports.value = data);
  const setReportTab = (tab: number) => (reportTab.value = tab);

  return {
    reportTab,
    setReportTab,
    reports,
    setReports,
    loading,
    setLoading,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useReportStore, import.meta.hot));
}
