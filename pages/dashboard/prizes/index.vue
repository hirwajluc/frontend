<template>
  <div class="flex flex-col gap-2">
    <div class="flex flex-col space-y-3">
      <Breadcrumb :home="home" :model="items">
        <template #item="{ item, props }">
          <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
            <a :href="href" v-bind="props.action" @click="navigate" class="flex items-center justify-center">
              <span :class="[item.icon, 'text-color']" />
              <span class="text-primary font-semibold">{{ item.label }}</span>
            </a>
          </router-link>
          <a v-else :href="item.url" :target="item.target" v-bind="props.action">
            <span class="text-surface-700 dark:text-surface-0">{{
              item.label
              }}</span>
          </a>
        </template>
      </Breadcrumb>

      <DashboardPrizeAddPrize />
    </div>

    <div>
      <div v-if="prizeTab == 'Histories'" class="card">
        <DataTable v-model:selection="selectedEntry" :value="filteredPrizesHistoryItems" dataKey="id"
          tableStyle="min-width: 50rem" stripedRows paginator :rows="10" :loading="loading"
          :globalFilterFields="['province', 'status']">
          <template #header>
            <div class="flex justify-between py-2">
              <div class="text-2xl font-semibold">Recent Histories</div>
              <div class="flex gap-x-4">
                <DatePicker v-model="dates" selectionMode="range" dateFormat="dd/mm/yy" :manualInput="false"
                  placeholder="Select Date Range" iconDisplay="input" showIcon />

              </div>
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
                  data.customer.id
                  }}</span>
                <small class="text-surface-500 dark:text-surface-0">{{
                  data.customer.network_operator
                  }}</small>
              </div>
            </template>
          </Column>
          <Column field="prize_category" header="Category">
            <template #body="{ data }">
              <div class="flex flex-col">
                <span class="text-surface-700 dark:text-surface-0">{{
                  data.prize_category.name
                  }}</span>
              </div>
            </template>
          </Column>
          <Column field="prize_value" header="Prize Value">
            <template #body="{ data }">
              <div class="flex flex-col">
                <span class="text-surface-700 dark:text-surface-0">{{
                  formatCurrency(data.value)
                  }}</span>
              </div>
            </template>
          </Column>

          <Column field="prize_type" header="Prize Type">
            <template #body="{ data }">
              <div class="flex flex-col">
                <span class="text-surface-700 dark:text-surface-0">{{
                  data.prize_type.name
                  }}</span>
              </div>
            </template>
          </Column>
          <Column field="entry_code" header="Entry Code"></Column>
          <Column field="created_at" header="Prize Date">
            <template #body="{ data }">
              <div class="flex flex-col">
                <span class="text-surface-700 dark:text-surface-0">{{
                  formatDateStandard(data.created_at)
                  }}</span>
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

      <div v-if="prizeTab == 'Prizes'" class="card">
        <DataTable v-model:selection="selectedEntry" :value="prizesItems" dataKey="id" tableStyle="min-width: 50rem"
          stripedRows paginator :rows="10" :loading="loading" :globalFilterFields="['province', 'status']">
          <template #header>
            <div class="flex justify-between py-2">
              <div class="text-2xl font-semibold">Recent Prizes</div>
              <div class="flex gap-x-4">
                <DatePicker v-model="dates" selectionMode="range" dateFormat="dd/mm/yy" :manualInput="false"
                  placeholder="Select Date Range" iconDisplay="input" showIcon />
              </div>
            </div>
          </template>
          <template #empty> No customers found. </template>
          <template #loading>
            <div class="loader"></div>
          </template>
           <Column field="id" header="Prize ID"></Column>
          <Column field="prize_name" header="Prize Name">
            <template #body="{ data }">
              <div class="flex flex-col">
                <span class="text-surface-700 dark:text-surface-0">{{
                  data.prize_name
                  }}</span>
                <small class="text-surface-500 dark:text-surface-0">{{
                  data.phone
                  }}</small>
              </div>
            </template>
          </Column>
          <Column field="prize_category" header="Category">
            <template #body="{ data }">
              <div class="flex flex-col">
                <span class="text-surface-700 dark:text-surface-0">{{
                  data.prize_category
                  }}</span>
              </div>
            </template>
          </Column>
          <Column field="prize_value" header="Prize Value">
            <template #body="{ data }">
              <div class="flex flex-col">
                <span class="text-surface-700 dark:text-surface-0">{{
                  data.prize_value
                  }}</span>
              </div>
            </template>
          </Column>

          <Column field="prize_type" header="Prize Type">
            <template #body="{ data }">
              <div class="flex flex-col">
                <span class="text-surface-700 dark:text-surface-0">{{
                  data.prize_type
                  }}</span>
              </div>
            </template>
          </Column>
          <Column field="elligibility" header="Elligibility"></Column>
          <Column field="distribution" header="Distribution">
            <template #body="{ data }">
              <div class="flex flex-col">
                <span class="text-surface-700 dark:text-surface-0">{{
                  data.distribution
                  }}</span>
              </div>
            </template>
          </Column>
          <Column field="status" header="Status">
            <template #body="{ data }">
              <div
                class="rounded-full flex px-4 py-1.5 text-sm text-center items-center justify-center text-primary bg-primary/10">
                {{ data.status }}
              </div>
            </template>
          </Column>
          <Column class="w-24 !text-end">
            <template #body="{ data }">

              <div class="flex gap-3 items-center">
                <Button icon="pi pi-stop-circle" @click="selectRow(data)" severity="secondary" text rounded></Button>
                <Button icon="pi pi-ellipsis-v" @click="selectRow(data)" severity="secondary" text rounded></Button>
                </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { WinnerType } from '~/types';

definePageMeta({
  title: "Manage Entries",
  layout: "dashboard",
  middleware: "auth",
});

const home = ref({
  icon: "pi pi-home",
  label: "Home",
  route: "/dashboard",
});
const items = ref([{ label: "Prize Distribution" }]);

const toast = useToast();
const selectRow = (data: any) => {
  toast.add({
    severity: "info",
    summary: data.customer,
    detail: data.phone + " | RB" + data.code,
    life: 3000,
  });
};
const  { formatDateStandard} = useDateFormatter();
const visible = ref(false);
const selectedEntry = ref<any>([]);

const prizeStore = usePrizeStore();
const prizeTab = computed(() => {
  return prizeStore.prizeTab;
});
const prizesItems = computed(() => {
  return prizeStore.prizeTypes.slice().sort((a: any, b: any) => b.id - a.id);
});
const prizesHistoryItems = computed(() => {
  return prizeStore.histories;
});
const loading = computed(() => {
  return prizeStore.loading;
});

const formatCurrency = (value: any) => {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
};

onMounted(() => {
  prizeStore.getAllPrizeTypes();
  prizeStore.getAllHistoryPrizeDistribution();
});

const dates = ref();
const op = ref();


const toggle = (event: any) => {
  op.value.toggle(event);
};

// Computed property for filtered items based on the date range
const filteredPrizesHistoryItems = computed(() => {
  if (!dates.value || dates.value.length !== 2) {
    return prizesHistoryItems.value; // Return all items if no valid date range
  }

  const [startDate, endDate] = dates.value;

  return prizesHistoryItems.value.filter((item: WinnerType) => {
    const claimedDate = new Date(item.claimed_date);
    return claimedDate >= startDate && claimedDate <= endDate;
  });
});
</script>

<style></style>
