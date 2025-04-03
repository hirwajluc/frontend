import { defineStore } from "pinia";
import { httpRequest } from "~/services";
import type { Winner, WinnerTypeData } from "~/types";

export const useDrawStore = defineStore("drawStore", () => {
  const loading = ref(false);
  const loadingData = ref(false);

  const draws = ref<WinnerTypeData[]>([]);
  const setDraws = (data: WinnerTypeData[]) => (draws.value = data);
  const setLoading = (data: boolean) => (loading.value = data);
  const setLoadingData = (data: boolean) => (loadingData.value = data);
  const draw = ref<WinnerTypeData>();
  const setDraw = (data: WinnerTypeData) => (draw.value = data);
  const draw_type = ref([]);
  const draw_value = ref([]);
  const setDrawType = (data: any) => (draw_type.value = data);
  const setDrawValue = (data: any) => (draw_value.value = data);
  const winners = ref([]);
  const setWinners = (data: any) => (winners.value = data);
  const pagination = ref({
    limit: 10, // Default per page, or set from API response
    page: 0, // Current page (0-indexed for Vue pagination)
    total: 0, // Total records from API response
  });
  const setPagination = (data: any) => (pagination.value = data);
  const alert = useAlertStore();
  const mainStore = useMainStore();

  const getAllDraws = (
    page?: any,
    limit?: any,
    start_date?: any,
    end_date?: any,
    code?: any
  ) => {
    setLoading(true);
    // Build query parameters only if dates are provided
    const params = [];
    if (start_date) params.push(`start_date=${start_date}`);
    if (end_date) params.push(`end_date=${end_date}`);
    if (page) params.push(`page=${page}`);
    if (limit) params.push(`limit=${limit}`);
    if (code) params.push(`code=${code}`);

    const query = params.length ? `?${params.join("&")}` : "";
    httpRequest
      .get(`/api/v1/draws${query}`)
      .then((res: any) => {
        setDraws(res.data);
        setPagination(res.pagination);
      })
      .catch((error: any) => {})
      .finally(() => {
        setLoadingData(false);
      });
  };

  const getAllDrawTypes = () => {
    setLoading(true);
    // Make API request to fetch all draws
    httpRequest
      .get("/api/v1/draw_types")
      .then((res: any) => {
        setDrawType(res.data);
      })
      .catch((error: any) => {})
      .finally(() => {
        setLoading(false);
      });
  };

  const getAllDrawValues = (typeId: any) => {
    setLoading(true);
    // Make API request to fetch all draws
    httpRequest
      .get(`/api/v1/draw_prize/${typeId}`)
      .then((res: any) => {
        setDrawValue(res.data);
      })
      .catch((error: any) => {})
      .finally(() => {
        setLoading(false);
      });
  };

  const startDrawing = (data: any) => {
    setLoading(true);
    httpRequest
      .post("/api/v1/draw", data)
      .then((res: any) => {
        if (res.status == 200) {
          setWinners(res.winner);
          alert.success(res.message);
          mainStore.setDrawModal(false);
        }
      })
      .catch((error: any) => {})
      .finally(() => {
        setLoading(false);
      });
  };
  const prizeStore = usePrizeStore();

  const setDrawing = (data: any) => {
    // setLoading(true);
    // console.log("data");
    // console.log(data);
    prizeStore.setCurrentType(data);
    mainStore.setDrawModal(false);
    navigateTo(`/winners`, { replace: false });
  };

  const deleteDraw = (id: any) => {
    setLoading(true);
    httpRequest
      .delete(`/api/v1/draw/${id}`)
      .then((res: any) => {
        getAllDraws();
        alert.success(res.message);
        mainStore.setDeleteModal(false);
      })
      .catch((error: any) => {})
      .finally(() => {
        setLoading(false);
      });
  };

  return {
    loading,
    draws,
    setDraws,
    setLoading,
    draw,
    setDraw,
    getAllDraws,
    getAllDrawTypes,
    getAllDrawValues,
    draw_type,
    draw_value,
    setDrawType,
    setDrawValue,
    startDrawing,
    loadingData,
    setLoadingData,
    deleteDraw,
    winners,
    setWinners,
    setDrawing,
    pagination,
    setPagination,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDrawStore, import.meta.hot));
}
