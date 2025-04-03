import { defineStore } from "pinia";

import { httpRequest } from "~/services";
import type {
  PrizeCategoryData,
  PrizeOverviewType,
  PrizeTypeData,
} from "~/types";

export const usePrizeStore = defineStore("prizeStore", () => {
  const loading = ref(false);
  const prizeTypes = ref<PrizeTypeData[]>([]);
  const currentType = ref<PrizeTypeData>();
  const currentCategory = ref<PrizeCategoryData>();
  const histories = ref([]);
  const prizeHistory = ref();
  const totalEntries = ref(0);
  const prizeTypeSpace = ref(null);
  const distributionTYpe = ref([]);
  const setDistributions = (data: any) => (distributionTYpe.value = data);
  const setPrizeOverview = (data: any) => (prizeOverview.value = data);
  const setPrizeOverviewV2 = (data: any) => (prizeOverviewV2.value = data);
  const setTotalEntries = (data: any) => (totalEntries.value = data);
  const setPrizeTypeSpace = (data: any) => (prizeTypeSpace.value = data);
  const prizeTab = ref("Histories");
  const prizeCategoryies = ref<PrizeCategoryData[]>([]);
  const setPrizeTypes = (data: any) => (prizeTypes.value = data);
  const setCurrentType = (data: any) => (currentType.value = data);
  const setCurrentCategory = (data: any) => (currentCategory.value = data);
  const setLoading = (data: boolean) => (loading.value = data);
  const setPrizeCategoryies = (data: any) => (prizeCategoryies.value = data);
  const setPrizeTab = (data: string) => (prizeTab.value = data);
  const setHistories = (data: any) => (histories.value = data);
  const setPrizeHistory = (data: any) => (prizeHistory.value = data);
  const alert = useAlertStore();
  const mainStore = useMainStore();
  const pagination = ref({
    limit: 10, // Default per page, or set from API response
    page: 0, // Current page (0-indexed for Vue pagination)
    total: 0, // Total records from API response
  });
  const prizeOverview = ref<PrizeOverviewType[]>([]);
  const prizeOverviewV2 = ref({
    payouts: {
      expected: 0,
      actual: 0,
    },
    winners: {
      paid: 0,
      pending: 0,
    },
    rewards: {
      distributed: 0,
      total: 0,
    }
  });
  const setPagionation = (data: any) => (pagination.value = data);

  const getAllHistoryPrizeDistribution = async (
    page?: any,
    limit?: any,
    code?: any,
    start_date?: any,
    end_date?: any,
    type_id?: any
  ) => {
    setLoading(true);
    // Build query parameters only if dates are provided
    const params = [];
    if (type_id) params.push(`type_id=${type_id}`);
    if (start_date) params.push(`start_date=${start_date}`);
    if (end_date) params.push(`end_date=${end_date}`);
    if (code) params.push(`code=${code}`);
    if (page) params.push(`page=${page}`);
    if (limit) params.push(`limit=${limit}`);

    const query = params.length ? `?${params.join("&")}` : "";

    await httpRequest
      .get(`/api/v1/prize_distributions${query}`)
      .then((res) => {
        setHistories(res.data);
        setPagionation(res.pagination);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getPrizeOverview = async (start_date?: any, end_date?: any) => {
    setLoading(true);
    // Build query parameters only if dates are provided
    const params = [];
    if (start_date) params.push(`start_date=${start_date}`);
    if (end_date) params.push(`end_date=${end_date}`);
    const query = params.length ? `?${params.join("&")}` : "";

    await httpRequest
      .get(`/api/v1/prize_overview${query}`)
      .then((res) => {
        setPrizeOverview(res.prize_overview);
        setTotalEntries(res.total_entries);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const getPrizeOverviewV2 = async (start_date?: any, end_date?: any) => {
    setLoading(true);
    // Build query parameters only if dates are provided
    const params = [];
    if (start_date) params.push(`start_date=${start_date}`);
    if (end_date) params.push(`end_date=${end_date}`);
    const query = params.length ? `?${params.join("&")}` : "";

    await httpRequest
      .get(`/api/v2/prize_overview${query}`)
      .then((res) => {
        setPrizeOverviewV2(res.prize_overview);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getAllPrizeCategories = async () => {
    setLoading(true);

    await httpRequest
      .get("/api/v1/prize_categories")
      .then((res) => {
        setPrizeCategoryies(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getAllPrizeTypes = async (prize_category?: any) => {
    setLoading(true);
    const url = prize_category
      ? `/api/v1/prize_type/${prize_category}`
      : `/api/v1/prize_type`;
    await httpRequest
      .get(url)
      .then((res) => {
        setPrizeTypes(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const getPrizeSpace = async (prize_type_id?: any) => {
    setLoading(true);
    const url = `/api/v1/prize_type_space/${prize_type_id}`;
    try {
      const res = await httpRequest.get(url);
      setPrizeTypeSpace({remaining: res.remaining, total: res.elligibility});
      setLoading(false);
      return res;
    } catch (error) {
      setLoading(false);
    }
  };
  const getPrizeDistributionTypes = async () => {
    setLoading(true);
    await httpRequest
      .get(`/api/v1/distribution-type`)
      .then((res) => {
        setDistributions(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const AddPrizeType = (data: any) => {
    //check if prize_category is object and convert to id (int)
    if (typeof data.prize_category === "object") {
      data.prize_category = data.prize_category.id;
    }
    setLoading(true);
    httpRequest
      .post("/api/v1/prize_type", data)
      .then((res) => {
        if (res.status == 200) {
          setLoading(false);
          alert.success(res.message);
          mainStore.setPrizeModal(false);
          mainStore.setUpdateModal(false);
          getAllPrizeTypes();

          setLoading(false);
        }
      })

      .finally(() => {
        setLoading(false);
      });
  };

  const AddPrizeCategorory = (data: any) => {
    setLoading(true);
    httpRequest
      .post("/api/v1/prize_category", data)
      .then((res) => {
        if (res.status == 200) {
          setLoading(false);
          getAllPrizeCategories();
          alert.success(res.message);
          mainStore.setPrizeModal(false);
          setLoading(false);
        }
      })

      .finally(() => {
        setLoading(false);
      });
  };

  const deletePrizeCategory = (id: any) => {
    setLoading(true);
    httpRequest
      .delete(`/api/v1/prize_category/${id}`)
      .then((res) => {
        if (res.status == 200) {
          alert.success(res.message);
          getAllPrizeCategories();
          setLoading(false);
          mainStore.setDeleteModal(false);
        }
      })

      .finally(() => {
        setLoading(false);
      });
  };

  const deletePrizeType = (id: any) => {
    setLoading(true);
    httpRequest
      .delete(`/api/v1/prize_type/${id}`)
      .then((res) => {
        if (res.status == 200) {
          alert.success(res.message);
          getAllPrizeTypes("prize_category");
          setLoading(false);
          mainStore.setDeleteModal(false);
        }
      })

      .finally(() => {
        setLoading(false);
      });
  };
  return {
    loading,
    setLoading,
    setPrizeTypes,
    prizeTypes,
    AddPrizeType,
    AddPrizeCategorory,
    getAllPrizeTypes,
    getAllPrizeCategories,
    prizeCategoryies,
    setPrizeTab,
    prizeTab,
    getAllHistoryPrizeDistribution,
    histories,
    setHistories,
    setCurrentType,
    currentType,
    setCurrentCategory,
    currentCategory,
    deletePrizeCategory,
    deletePrizeType,
    getPrizeDistributionTypes,
    distributionTYpe,
    setDistributions,
    getPrizeOverview,
    getPrizeOverviewV2,
    prizeOverview,
    prizeOverviewV2,
    setPrizeOverview,
    setPrizeOverviewV2,
    prizeHistory,
    setPrizeHistory,
    pagination,
    setPagionation,
    getPrizeSpace,
    prizeTypeSpace,
    setPrizeTypeSpace,
    setTotalEntries,
    totalEntries
  };
});
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePrizeStore, import.meta.hot));
}
