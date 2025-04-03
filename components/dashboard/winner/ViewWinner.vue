<template>
  <div>
    <Dialog v-model:visible="winnerModal" @update:visible="handleDialogClose" :style="{ width: '30vw' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
      <template #header>
        <div class="flex flex-col items-start justify-center gap-2 px-2">
          <span class="font-bold text-xl whitespace-nowrap">Winner details</span>
          <small class="font-light whitespace-nowrap">in-depth information about a specific winner.</small>
        </div>
      </template>
      <div v-if="entryStore.loading" class="flex flex-col items-center space-y-2 p-4">
        <ProgressSpinner />
        <small>Loading customer data...</small>
      </div>

      <div v-else class="flex flex-col space-y-2">
        <div class="bg-gray-100  space-y-2 p-4 rounded">
          <p class="text-sm"><strong>Customer Names:</strong> {{ customer?.names }}</p>
          <p class="text-sm"><strong>Customer Phone:</strong> {{ customer?.phone }}
            <Button size="small" icon="pi pi-copy" label="Copy" @click="copyToClipboard(customer?.phone??'')" class="p-button-outlined" />
          </p>
          <p class="text-sm"><strong>Customer Locale:</strong> {{ customer?.locale }}</p>
          <p class="text-sm"><strong>Customer Network Operator:</strong> {{ customer?.network_operator }}
          </p>
          <p class="text-sm"><strong>Province:</strong> {{ customer?.province.name }}</p>
          <p class="text-sm"><strong>District:</strong> {{ customer?.district.name }}</p>
        </div>

        <div class="bg-gray-100  space-y-2 p-4 rounded">
          <p class="text-sm"><strong>Entry Code:</strong> {{ prize?.code }}
            <Button size="small" icon="pi pi-copy" label="Copy" @click="copyToClipboard(prize?.code, 'Code')" class="p-button-outlined" />
          </p>
          <p class="text-sm"><strong>Created Date:</strong> {{ prize?.created_at }}</p>
          <p class="text-sm"><strong>Prize type:</strong> {{ prize?.prize_type?.name }}</p>
        </div>
      </div>
      <div class="pt-4 gap-4 flex justify-end">
        <Button outlined label="Cancel" icon="pi pi-cancel" iconPos="right" size="small" severity="danger"
          @click="mainStore.setWinnerModal(false)" />
      </div>

    </Dialog>
  </div>
</template>

<script lang="ts" setup>
const prizeStore = usePrizeStore();
const mainStore = useMainStore();
const entryStore = useEntriesStore();
const drawStore = useDrawStore();
const toast = useToast();
const winnerModal = computed(() => {
  return mainStore.winnerModal;
});
const prizeOld = computed(() => {
  return prizeStore.prizeHistory;
});

const prize = computed(() => {
  return drawStore.draw;
});
const customer = computed(() => {
  return entryStore.customerInfo;
});
function handleDialogClose(visible: any) {
  if (!visible) {
    mainStore.setWinnerModal(false);
  }
}
function copyToClipboard(textToCopy:string, key: string = "phone") {
  navigator.clipboard.writeText(textToCopy).then(() => {
    toast.add({
      severity: 'success',
      summary: 'Copied!',
      detail: key + ' has been copied to clipboard',
      life: 3000,
    });
  });
}
</script>

<style></style>
