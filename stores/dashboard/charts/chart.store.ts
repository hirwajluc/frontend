import { defineStore } from 'pinia';
import { ref } from 'vue';
import { httpRequest } from '~/services';  // Assuming you have an httpRequest function for API calls

export const useChartStore = defineStore('chartData', () => {
  const seriesData = ref<{ [key: string]: { airtel: number; mtn: number } }>({
    kigali: { airtel: 0, mtn: 0 },
    south: { airtel: 0, mtn: 0 },
    north: { airtel: 0, mtn: 0 },
    east: { airtel: 0, mtn: 0 },
    west: { airtel: 0, mtn: 0 }
  });
  const seriesWinnerData = ref<{ [key: string]: { airtel: number; mtn: number } }>({
    kigali: { airtel: 0, mtn: 0 },
    south: { airtel: 0, mtn: 0 },
    north: { airtel: 0, mtn: 0 },
    east: { airtel: 0, mtn: 0 },
    west: { airtel: 0, mtn: 0 }
  });

  const loading = ref(false);
  const setLoading = (value: boolean) => (loading.value = value);

  // Actions
  const setSeriesData = (newSeries: { [key: string]: { airtel: number; mtn: number } }) => {
    seriesData.value = newSeries;
  };

  const setSeriesWinnerData = (newSeries: { [key: string]: { airtel: number; mtn: number } }) => {
    seriesWinnerData.value = newSeries;
  };

  // Fetch series players data from API
  const fetchSeriesData = async (start_date?: any, end_date?: any) => {
    const params = [];
    if (start_date) params.push(`start_date=${start_date}`);
    if (end_date) params.push(`end_date=${end_date}`);
    const query = params.length ? `?${params.join("&")}` : ""; 

    setLoading(true);
    httpRequest.get(`/api/v1/player-metrics${query}`).then((response: any) => {
      if (response.status === 200) {
        setSeriesData(response.data); 
      }
    }).catch((err: any) => {
      console.error('Failed to fetch series data:', err);
      loading.value = false;
    }).finally(() => {
      setLoading(false);
    });
  };
  // Fetch series winners data from API
  const fetchSeriesWinnerData = async (start_date?: any, end_date?: any) => {
    const params = [];
    if (start_date) params.push(`start_date=${start_date}`);
    if (end_date) params.push(`end_date=${end_date}`);
    const query = params.length ? `?${params.join("&")}` : "";

    setLoading(true);
    httpRequest.get(`/api/v1/winner-metrics${query}`).then((response: any) => {
      if (response.status === 200) {
        setSeriesWinnerData(response.data); 
      }
    }).catch((err: any) => {
      console.error('Failed to fetch series data:', err);
      loading.value = false;
    }).finally(() => {
      setLoading(false);
    });
  };
 

  return {
    seriesData,
    seriesWinnerData,
    loading,
    setLoading,
    fetchSeriesData,
    fetchSeriesWinnerData,
    setSeriesData,
    setSeriesWinnerData,
  
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useChartStore, import.meta.hot));
}
