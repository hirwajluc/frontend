<template>
  <div class="lg:grid grid-cols-12 gap-4">
    <div class="  lg:col-span-8 border border-border rounded-lg p-3">
      <DataTable v-model:selection="selectedEntry" :value="filteredEntryItems" dataKey="id"
        tableStyle="min-width: 50rem" stripedRows paginator :rows="10" :loading="loading" :globalFilter="globalFilter"
        :globalFilterFields="['customer', 'status']">
        <template #header>
          <div class="flex justify-between gap-4">
            <div class="text-2xl font-semibold">Recently Entries</div>
            <IconField>
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText v-model="globalFilter" placeholder="Keyword Search" />
            </IconField>
          </div>
        </template>
        <template #empty>
          <div class="p-12 flex-col flex items-center space-y-2 justify-center">
            <div><img src="/assets/images/empty_item.svg" class="m-2 h-32"></div>
            <div>No records found.</div>
          </div>
        </template>
        <template #loading>
          <div class="loader"></div>
        </template>
        <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
        <Column field="customer" header="Customer">
          <template #body="{ data }">
            <div class="flex flex-col blur-sm select-none">
              <span class="text-surface-700 dark:text-surface-0">{{
                data.customer.names
                }}</span>
              <small class="text-surface-500 dark:text-surface-0">{{
                data.customer.phone
                }}</small>
            </div>
          </template>
        </Column>
        <Column field="entry_at" header="Entry At">
          <template #body="{ data }">
            <div class="flex flex-col">
              <small class="text-surface-700 dark:text-surface-0">{{
                formatDateStandard(data.created_at)
                }}</small>
            </div>
          </template>
        </Column>
        <Column field="code" header="Entry Code">
          <template #body="{ data }">
            <div class="flex flex-col">
              <small class="text-surface-700 dark:text-surface-0">{{
                data.code.code
                }}</small>
            </div>
          </template>
        </Column>
        <Column field="customer" header="Location">
          <template #body="{ data }">
            <div class="flex flex-col">

              <small class="text-surface-500 dark:text-surface-0">{{ data.customer.province.name }} - {{
                data.customer.district.name }} </small>
            </div>
          </template>
        </Column>

        <Column class="w-24 !text-end">
          <template #body="{ data }">
            <Button icon="pi pi-ellipsis-v" severity="secondary" text rounded></Button>

          </template>
        </Column>
      </DataTable>
    </div>
    <div class="lg:col-span-4  flex flex-col items-center border border-border space-y-6 rounded-lg p-4">
      <div class="text-2xl text-left flex w-full text-black font-semibold">Prize Distribution Type</div>

      <div v-if="prizeLoading" class="loader"></div>
      <div v-else>
        <div class=" bg-slate-100  lg:grid grid-cols-12 gap-x-4 p-2">

          <div class=" col-span-3 items-center justify-start  ">
            <div class="text-xs  text-left font-bold ">PRIZE TYPE</div>
          </div>
          <div class=" col-span-3  items-center justify-center">
            <div class="text-sm text-left font-bold">TOTAL PRIZE</div>
          </div>
          <div class="col-span-3  items-center justify-center">
            <div class="text-sm text-left font-bold">TOTAL COUNT</div>
          </div>
          <div class="col-span-3  items-center justify-center">
            <div class="text-sm text-left font-bold">TOTAL ELIGIBILITY</div>
          </div>
        </div>
        <div v-for="prize in prizeItems" class="   lg:grid grid-cols-12 gap-x-4 p-2">

          <div class="  col-span-3 items-center justify-start  ">
            <div class="text-lg text-left font-semibold text-primary">{{ prize.prize_type }}</div>
          </div>
          <div class=" col-span-3  items-center justify-center">
            <div class="text-md text-left font-medium">{{ prize.total_prize }}</div>
          </div>
          <div class="col-span-3  items-center justify-center">
            <div class="text-md text-left font-medium">{{ prize.prize_count }}</div>
          </div>
          <div class="col-span-3  items-center justify-center">
            <div class="text-md text-left font-medium">{{ prize.total_elligibility }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>


</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { CustomerType } from "~/types";
const { $echarts } = useNuxtApp();
const chart = ref(null);
const productPrize = ref(null);
const globalFilter = ref(''); // Reactive property for search input

const { formatDateStandard } = useDateFormatter()
const { formatWithSeparator } = useThousandSeparator()
const selectedEntry = ref<any>([]);

const entrieStore = useEntriesStore();
const prizeStore = usePrizeStore();

const entriesItems = computed(() => {
  return entrieStore.entries;
});

const prizeItems = computed(() => {
  return prizeStore.prizeOverview;
});
const loading = computed(() => {
  return entrieStore.loading;
});

const prizeLoading = computed(() => {
  return prizeStore.loading;
});

const filteredEntryItems = computed(() => {
  if (!globalFilter.value) {
    return entriesItems.value; // Return all codes if no filter is applied
  }
  const filter = globalFilter.value.toLowerCase();
  return entriesItems.value.filter((entry: CustomerType) => {
    return (
      entry.code.code.toLowerCase().includes(filter) ||
      entry.customer.names.toLowerCase().includes(filter) ||
      entry.customer.phone.toLowerCase().includes(filter) ||
      entry.customer.district.name.toLowerCase().includes(filter) ||
      entry.customer.province.name.toLowerCase().includes(filter)
    );
  });
});
</script>
