<template>
  <div>
    <Dialog v-model:visible="entriesModal" @update:visible="handleDialogClose" :style="{ width: '30vw' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
      <template #header>
        <div class="flex flex-col items-start justify-center gap-2 px-2">
          <span class="font-bold text-xl whitespace-nowrap">Entry details</span>
          <small class="font-light whitespace-nowrap">in-depth information about a specific entry.</small>
        </div>
      </template>
      <div v-if="entryStore.loading" class="flex flex-col items-center space-y-2 p-4">
        <ProgressSpinner />
        <small>Loading entry data...</small>
      </div>
      <div v-else class="flex flex-col space-y-2">
        <!-- Customer Details -->
        <div class=" ">
          <h2 class="text-md font-semibold mb-2">Customer Details</h2>
          <div class="bg-gray-100 p-4 rounded">
            <p class="text-sm"><strong>Customer Names:</strong> {{ customer?.customer.names ?? '-----------' }}</p>
            <p class="text-sm"><strong>Phone:</strong> {{ customer?.customer.phone ?? '-----------' }}</p>
            <p class="text-sm"><strong>Location:</strong> {{ customer?.customer.province.name + ',' +
              customer?.customer.district.name }}</p>
            <p class="text-sm"><strong>Registration Date:</strong> {{ formatDateStandard(customer?.created_at) }}</p>
          </div>
        </div>

        <!-- Entry Details -->
        <div class=" ">
          <h2 class="text-md font-semibold mb-2">Code Details</h2>
          <div class="bg-gray-100 p-4 rounded">
            <p class="text-sm"><strong>Created time:</strong> {{ formatDateStandard(customer?.code.created_at) }} </p>
            <p class="text-sm "><strong>Entry Code:</strong> {{ customer?.code.code }}</p>
            <p class="text-sm"><strong>Prize Type:</strong> {{ customer?.code.prize_type?.name ?? "No Prize won" }}</p>

          </div>
        </div>

        <!-- Prize Details -->
        <div v-if="customer?.prize" class="">
          <h2 class="text-md  font-semibold mb-2">Prize Details</h2>
          <div class="bg-gray-100 p-4 rounded">
            <p class="text-sm  "><strong>Prize Type:</strong> {{ customer?.code.prize_type?.name ?? "No Prize " }}</p>
            <p class="text-sm  "><strong>Prize Value:</strong>
              {{ customer?.prize?.value }} </p>
            <p class="text-sm"><strong>Distribution Date:</strong> {{ formatDateStandard(customer?.prize.created_at) }}
            </p>
          </div>
        </div>
      </div>
      <div class="pt-4 gap-4 flex justify-end">
        <Button outlined label="Cancel" icon="pi pi-cancel" iconPos="right" severity="danger"
          @click="mainStore.setEntriesModal(false)" />

      </div>

    </Dialog>
  </div>
</template>

<script lang="ts" setup>
const { formatDateStandard } = useDateFormatter();
const entryStore = useEntriesStore();
const mainStore = useMainStore();

const entriesModal = computed(() => {
  return mainStore.entriesModal;
});
const customer = computed(() => {
  return entryStore.customer;
});

function handleDialogClose(visible: any) {
  if (!visible) {
    mainStore.setEntriesModal(false);
  }
}

</script>

<style></style>
