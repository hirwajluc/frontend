import { defineStore } from "pinia";
import { httpRequest } from "~/services";
import type { AccountData, EmailType, Login, PasswordType } from "~/types";

export const useAuthStore = defineStore("authStore", () => {
  const user = useCookie<AccountData>("user", {
    maxAge: 60 * 60,
    sameSite: "strict",
    httpOnly: false,
  });
  const loading = ref(false);
  const isAvailable = ref(true);
  const token = useCookie("token", {
    maxAge: 60 * 60,
    sameSite: "strict",
    httpOnly: false,
  });
  const error = ref();
  const setError = (data: any) => (error.value = data);
  const setToken = (data?: string) => (token.value = data);
  const setUser = (data?: any) => (user.value = data);
  const setLoading = (value: boolean) => (loading.value = value);
  const setIsAvailable = (value: boolean) => (isAvailable.value = value);
  const alert = useAlertStore();

  const login = (credentials: Login) => {
    setLoading(true);
    httpRequest
      .post("/api/v1/login", credentials)
      .then((res) => {
        if (res.status == 200) {
          setToken(res.accessToken);
          setUser(res.data);
          setLoading(false);
          if (res.data.force_change_password) {
            navigateTo(`/settings/change_password`, { replace: true });
          } else {
            navigateTo(`/dashboard`, { replace: true });
          }
        } else {
          alert.error(res.message);
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        setToken();
        setUser();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const logout = () => {
    setUser();
    setToken();
    navigateTo(`/auth/login`, { replace: true });
  };

  const checkToken = async () => {
    setLoading(true);
    await httpRequest
      .get("/api/v1/profile")
      .then((res) => {
        setUser(res.data);
      })
      .catch((error) => {
        setLoading(false);
        setToken();
        setUser();
        navigateTo(`/auth/login`, { replace: true });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const setPassword = async (data: PasswordType) => {
    setLoading(true);
    await httpRequest
      .post("/api/v1/set_password", data)
      .then((res) => {
        if (res.status == 200) {
          setLoading(false);
          alert.success(res.message);
          navigateTo("/auth/login");
        } else {
          alert.error(res.message);
          setLoading(false);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const requestResetPassword = async (data: EmailType) => {
    setLoading(true);
    await httpRequest
      .post("/api/v1/forgot_password", data)
      .then((res) => {
        if (res.status == 200) {
          setLoading(false);
         navigateTo({
           path: "/auth/verify-otp",
           query: {
             reset_key: res.reset_key,
             type: "reset",
           },
           replace: true,
         });
        } else {
          alert.error(res.message);
          setLoading(false);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const validateOtp = (data: any, token?: string) => {
    setLoading(true);
    httpRequest
      .post("/api/v1/validate_otp", data)
      .then((res: any) => {
        setLoading(false);
       
        alert.success(res.message);
        //check if token is okay the add invitation_id
        navigateTo({
          path: "/auth/set-password",
          query: {
            reset_key: res.reset_key,
            type: "password",
          },
          replace: true,
        });
      })
      .catch((error: any) => {})
      .finally(() => {
        setLoading(false);
      });
  };


   

  return {
    user,
    loading,
    isAvailable,
    token,
    error,
    setError,
    setToken,
    setUser,
    setLoading,
    setIsAvailable,
    login,
    logout,
    checkToken,
    setPassword,
    requestResetPassword,
    validateOtp,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
