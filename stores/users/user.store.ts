import { defineStore } from "pinia";
import { httpRequest } from "~/services";
import type { AccountData } from "~/types";

export const useUserStore = defineStore("userStore", () => {
  const loading = ref(false);
  const setLoading = (data: boolean) => (loading.value = data);
  const users = ref<AccountData[]>([]);
  const departments = ref([]);
  const setDepartments = (data: any) => (departments.value = data);
  const activity_logs = ref<any>([]);
  const setUsers = (data: AccountData[]) => (users.value = data);
  const user = ref<AccountData>();
  const setUser = (data: AccountData) => (user.value = data);
  const setActivityLogs = (data: any) => (activity_logs.value = data);
  const alert = useAlertStore();
  const mainStore = useMainStore();
  const pagination = ref({
    limit: 10, // Default per page, or set from API response
    page: 0, // Current page (0-indexed for Vue pagination)
    total: 0, // Total records from API response
  });
  const setPagionation = (data: any) => (pagination.value = data);
  const getAllUsers = () => {
    setLoading(true);
    // Make API request to fetch all codes
    httpRequest
      .get("/api/v1/users")
      .then((res: any) => {
        setUsers(res.data);
      })
      .catch((error: any) => {})
      .finally(() => {
        setLoading(false);
      });
  };

  const getAllDepartment = () => {
    setLoading(true);
    // Make API request to fetch all codes
    httpRequest
      .get("/api/v1/departments")
      .then((res: any) => {
        setDepartments(res.data);
      })
      .catch((error: any) => {})
      .finally(() => {
        setLoading(false);
      });
  };

  const getUserActivityLogs = (
    user_id?: any,
    start_date?: any,
    end_date?: any,
    search?: any,
    page?: any,
    limit?: any,
  ) => {
    setLoading(true);
    // Build query parameters only if dates are provided
    const params = [];
    if (user_id) params.push(`user_id=${user_id}`);
    if (start_date) params.push(`start_date=${start_date}`);
    if (end_date) params.push(`end_date=${end_date}`);
    if (search) params.push(`query=${search}`);
    if (page) params.push(`page=${page}`);
    if (limit) params.push(`limit=${limit}`);

    const query = params.length ? `?${params.join("&")}` : "";

    httpRequest
      .get(`/api/v1/logs${query}`)
      .then((res: any) => {
        setActivityLogs(res.data);
        setPagionation(res.pagination);
      })
      .catch((error: any) => {})
      .finally(() => {
        setLoading(false);
      });
  };
  const addUser = (data: any) => {
    setLoading(true);
    httpRequest
      .post("/api/v1/user", data)
      .then((res) => {
        if (res.status == 200) {
          setLoading(false);
          alert.success(res.message);
          mainStore.setAddUserModal(false);
          getAllUsers();
          setLoading(false);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const updateUser = (data: any) => {
    setLoading(true);
    httpRequest
      .post(`/api/v1/user/${data.id}`, data)
      .then((res) => {
        if (res.status == 200) {
          setLoading(false);
          alert.success(res.message);
          mainStore.setUpdateModal(false);
          getAllUsers();
          setLoading(false);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const changeUserStatus = (user: any, status: any) => {
    setLoading(true);

    httpRequest
      .post(`/api/v1/user_status/${user.id}`, {
        status: status,
      })
      .then((res) => {
        if (res.status == 200) {
          mainStore.setDeleteModal(false);
          alert.success(res.message);

          getAllUsers();
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return {
    loading,
    getAllUsers,
    users,
    setUsers,
    setLoading,
    addUser,
    user,
    setUser,
    setActivityLogs,
    getUserActivityLogs,
    activity_logs,
    getAllDepartment,
    departments,
    changeUserStatus,
    setDepartments,
    pagination,
    updateUser,
    setPagionation,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
