import { defineStore } from "pinia";

export const useMainStore = defineStore("mainStore", () => {
  const saved = ref(false);
  const prizeModal = ref(false);
  const memberModal = ref(false);
  const entriesModal = ref(false);
  const winnerModal = ref(false);
  const deleted = ref(false);
  const activeMenu = useCookie("ACTIVE_MENU", { maxAge: 60 * 60 });
  const customStep = ref(1);
  const customType = ref("");
  const activeSubMenu = useCookie("ACTIVE_SUBMENU_URL", { maxAge: 60 * 60 });
  const showSidebar = ref(false);
  const uploadModal = ref(false);
  const deleteModal = ref(false);
  const addUserModal = ref(false);
  const drawModal = ref(false);
  const viewDrawModal = ref(false);
  const updateModal = ref(false);
  const approvalModal = ref(false);


  const setAddUserModal = (data: boolean) => (addUserModal.value = data);
  const setDeleteModal = (data: boolean) => (deleteModal.value = data);
  const setUploadModal = (data: boolean) => (uploadModal.value = data);
  const setShowSidebar = (data: boolean) => (showSidebar.value = data);
  const setMemberModal = (data: boolean) => (memberModal.value = data);
  const setSaved = (data: boolean) => (saved.value = data);
  const setDeleted = (data: boolean) => (deleted.value = data);
  const setActiveMenu = (data: string) => (activeMenu.value = data);
  const setActiveSubMenu = (data: string) => (activeSubMenu.value = data);
  const setCustomStep = (data: any) => (customStep.value = data);
  const setCustomType = (data: any) => (customType.value = data);
  const setPrizeModal = (data: boolean) => (prizeModal.value = data);
  const setEntriesModal = (data: boolean) => (entriesModal.value = data);
  const setDrawModal = (data: boolean) => (drawModal.value = data);
  const setWinnerModal = (data: boolean) => (winnerModal.value = data);
  const setViewDrawModal = (data: boolean) => (viewDrawModal.value = data);
  const setUpdateModal = (data: boolean) => (updateModal.value = data);
  const setApprovalModal = (data: boolean) => (approvalModal.value = data);


  return {
    saved,
    deleted,
    activeMenu,
    activeSubMenu,
    memberModal,
    showSidebar,
    customStep,
    customType,
    setCustomType,
    setActiveMenu,
    setActiveSubMenu,
    setShowSidebar,
    setCustomStep,
    setSaved,
    setDeleted,
    setMemberModal,
    setPrizeModal,
    prizeModal,
    entriesModal,
    setEntriesModal,
    uploadModal,
    setUploadModal,
    deleteModal,
    setDeleteModal,
    addUserModal,
    setAddUserModal,
    drawModal,
    setDrawModal,
    winnerModal,
    setWinnerModal,
    viewDrawModal,
    setViewDrawModal,
    updateModal,
    setUpdateModal,
    approvalModal,
    setApprovalModal,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMainStore, import.meta.hot));
}
