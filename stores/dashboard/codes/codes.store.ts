import { defineStore } from "pinia";
import { httpRequest } from "~/services";
import type { CodeOverviewType } from "~/types";

export const useCodesStore = defineStore("codesStore", () => {
  const loading = ref(false);
  const setLoading = (data: boolean) => (loading.value = data);
  const codes = ref([]);
  const codeOverview = ref<CodeOverviewType>({
    totalCode: "",
    usedCode: "",
    remainCode: "",
  });
  const mainStore = useMainStore();
  const alert = useAlertStore();
  const setCodeOverview = (data: any) => (codeOverview.value = data);
  const setCodes = (data: any) => (codes.value = data);

  const getAllCodeOverview = () => {
    setLoading(true);
    // Make API request to fetch all codes
    httpRequest
      .get("/api/v1/code-overview")
      .then((res: any) => {
        setCodeOverview(res.data);
      })
      .catch((error: any) => {})
      .finally(() => {
        setLoading(false);
      });
   };
 const uploadCodes = (file: any) => {
   setLoading(true);
   // Create FormData and append file
   const formData = new FormData();
   formData.append("file", file);

   // Make API request to upload codes
   httpRequest
     .post("/api/v1/upload_codes", formData, true)
     .then((res: any) => {
       alert.success(res.message);
       mainStore.setUploadModal(false);
     })
     .catch((error: any) => {
       console.error("Upload error:", error); // Handle error during upload
     })
     .finally(() => {
       setLoading(false);
     });
 };



   return {
     loading,
     getAllCodeOverview,
     codes,
     setCodes,
     setLoading,
     codeOverview,
     setCodeOverview,
     uploadCodes,
   };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCodesStore, import.meta.hot));
}
