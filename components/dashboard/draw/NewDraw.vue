<template>
  <div>
    <div class="flex items-center gap-x-4">

      <Button v-if="authStore.user.can_trigger_draw" type="button" icon="pi pi-file-arrow-up" label="New Draw" @click="createNewDraw()" />
    </div>
    <Dialog v-model:visible="drawModal" modal @update:visible="handleUploadDialogClose" :style="{ width: '30vw' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
      <template #header>
        <div class="flex flex-col items-start justify-center gap-2 px-2">
          <span class="font-bold text-xl whitespace-nowrap">New Draw</span>
          <small class="font-light whitespace-nowrap">Select attributes pertaining to the new Draw</small>
        </div>
      </template>

      <div class="flex flex-col gap-3">
        <div class="flex flex-col gap-1">
          <div class="font-semibold text-sm">Prize Type</div>
          <Dropdown v-model="prize_type" :options="prizeTypeItems" item="item" optionLabel="name" optionDisabled="trigger_by_system"
            placeholder="Select prize type" class="w-full" />
          <small class="text-red-500 text-xs" v-if="errors.prize_type">
            {{ errors.prize_type }}</small>
        </div>
      </div>
      <div class="flex justify-end gap-2 mt-4 md:mt-6">
        <Button type="button" label="Cancel" severity="danger" @click="mainStore.setDrawModal(false)"></Button>
        <Button type="button" label="Start Draw" icon="pi pi-play" :loading="loading" :disabled="loading"
          @click="onStartDraw()"></Button>
      </div>
    </Dialog>

    <Dialog v-model:visible="deleteModal" modal header="Delete" @update:visible="handleDeleteDialogClose"
      :style="{ width: '25vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
      <p class="m-0">
        Are you sure you want to delete this record? {{ draw?.entry_code }}
      </p>
      <div class="flex justify-end gap-2 mt-4">
        <Button type="button" label="Cancel" severity="danger" text @click="mainStore.setDeleteModal(false)"></Button>
        <Button type="button" label="Delete" severity="danger" icon="pi pi-trash" :loading="loading" :disabled="loading"
          @click="deleteDraw(draw?.id)"></Button>
      </div>
    </Dialog>

  </div>
</template>

<script lang="ts" setup>
import { object, string, number, date, type InferType, boolean } from "yup";
import type { PrizeTypeData } from "~/types";

const mainStore = useMainStore()
const prizeStore = usePrizeStore();
const drawStore = useDrawStore();
const userStore = useUserStore();
const alert = useAlertStore();

const authStore = useAuthStore();

const drawModal = computed(() => {
  return mainStore.drawModal
})
const deleteModal = computed(() => {
  return mainStore.deleteModal
})
const departments = computed(() => {
  return userStore.departments || [];
})
const viewDrawModal = computed(() => {
  return mainStore.viewDrawModal
})
const prize_type = ref({})

const drawSchema = object({
  prize_type: string().required("Prize type is required"),
});

const draw = computed(() => {
  return drawStore.draw;
})

const errors = reactive({
  prize_type: null,

});
function handleUploadDialogClose(visible: any) {
  if (!visible) {
    mainStore.setDrawModal(false);
  }
}

function handleDeleteDialogClose(visible: any) {
  if (!visible) {
    mainStore.setDeleteModal(false);
  }
}

function handleDrawDialogClose(visible: any) {
  if (!visible) {
    mainStore.setViewDrawModal(false);
  }
}

const prizeTypeItems = computed(() => {
  return prizeStore.prizeTypes;
})

function customItemTemplate(option:any) {
      return {
        content: option.name,
        disabled: option.trigger_by_system
      };
    }

function createNewDraw() {
  mainStore.setDrawModal(true);
  // Open the modal for drawing
  prizeStore.getAllPrizeTypes();
}

function deleteDraw(drawId: any) {
  // Open the delete modal
  prizeStore.deletePrizeType(drawId);
}
const loading = computed(() => {
  return prizeStore.loading;
})
async function onStartDraw() {
  if (!prize_type.value?.id) {
    return
  }
  const spaceAvailable = await prizeStore.getPrizeSpace(prize_type.value.id);
  if (spaceAvailable.remaining < 1) {
    alert.error("No space available for this prize type");
    return
  }
  prize_type.value.elligibility = spaceAvailable.remaining;
  drawStore.setDrawing(prize_type.value)
}
</script>