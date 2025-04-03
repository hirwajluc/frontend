<template>
  <div class="flex flex-col gap-4">
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

    <div>
      <div class="card">
        <DataTable v-model:selection="selectedEntry" :value="drawsItems" dataKey="id"
          tableStyle="min-width: 50rem" stripedRows :loading="loading" :globalFilter="globalFilter"
          :globalFilterFields="['province', 'status']">
          <template #header>
            <div class="flex justify-between py-4 ">
              <IconField>
                <InputIcon>
                  <i class="pi pi-search" />
                </InputIcon>
                <InputText v-model="globalFilter" @input="onSearchChange" placeholder="Keyword Code" />
              </IconField>

              <div class="flex gap-x-4">
                <DatePicker v-model="dates" @update:modelValue="getDrawsByDate(dates[0], dates[1])" selectionMode="range"
                  :manualInput="false" placeholder="01-01-2020 02-02-2021" />
                <DashboardWinnerViewWinner />
                <DashboardDrawNewDraw  />
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
           <Column field="id" header="Draw ID"></Column>
          <Column field="prize_type.name" header="Prize Type"></Column>
          <!-- <Column field="claimed_date" header="Claimed Date">
            <template #body="{ data }">
              <div class="flex items-center gap-x-3">
                <span class="text-surface-700 dark:text-surface-0">{{
  formatDateStandard(data.claimed_date)
                  }}</span>
              </div>
            </template>
          </Column> -->
          <Column field="customer" header="Winner">
            <template #body="{ data }">
              <div class="flex  blur-sm select-none  flex-col">
                <span class="text-surface-700 dark:text-surface-0">{{
                  data.customer.names
                  }}</span>
                <small class="text-surface-500 dark:text-surface-0">{{
                  data.customer.phone
                  }}</small>
              </div>
            </template>
          </Column>
          <Column field="prize_type" header="Prize Value">
            <template #body="{ data }">
              <div class="flex flex-col">
                <span class="text-surface-700 dark:text-surface-0">{{
                  data.prize_type.value
                  }}</span>
              </div>
            </template>
          </Column>
          <Column field="code" header="Entry Code"></Column>

          <Column field="status" header="Status">
            <template #body="{ data }">
              <div
                class="rounded-full flex px-4 py-1.5 text-sm text-center items-center justify-center text-primary bg-primary/10">
                {{ data.status }}
              </div>
            </template>
          </Column>
          <Column header="Action" class="w-24 !text-end">
            <template #body="{ data }">
              <div class="flex items-center gap-x-3">
                <Button icon="pi pi-eye" iconPos="left" size="small" label="Winner" @click="viewDraw(data)"
                  severity="secondary" text></Button>
                <Button icon="pi pi-trash" @click="deleteRowAction(data)" size="small" severity="danger" text></Button>
              </div>

            </template>
          </Column>
        </DataTable>
        <Paginator :rows="pagination.limit" :totalRecords="pagination.total"
          :first="pagination.page * pagination.limit - 1" @page="onPageChange">
          <template #start="slotProps">
            Page: {{ slotProps.state.page }}
            First: {{ slotProps.state.first }}
            Rows: {{ slotProps.state.rows }}
          </template>

        </Paginator>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { WinnerTypeData } from '~/types';

definePageMeta({
  title: "Manage Entries",
  layout: "dashboard",
  middleware: "auth",
});
const mainStore = useMainStore();
const home = ref({
  icon: "pi pi-home",
  label: "Home",
  route: "/dashboard",
});
const items = ref([{ label: "Trigger Draw" }]);
 const formattedStartDate = ref('')
const formattedEndDate = ref('')
const globalFilter = ref('')
const page = ref(1);
const pageCount = ref(10);
const dates = ref();

const selectedEntry = ref<any>([]);
const { formatDateStandard } = useDateFormatter();

const drawStore = useDrawStore();
const prizeStore = usePrizeStore();
const drawsItems = computed(() => {
  return drawStore.draws;
});
const loading = computed(() => {
  return drawStore.loadingData;
});

onMounted(() => {
  drawStore.getAllDraws();
});


const pagination = computed(() => {
  return drawStore.pagination;
});

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // getMonth() returns 0-11, so add 1
  const day = date.getDate();

  return `${year}-${month}-${day}`;
};
const entrieStore = useEntriesStore();

function formatFullDate(dateString: any) {
  const [year, month, day] = dateString.split('-');
  // Add leading zero if necessary
  const formattedMonth = month.padStart(2, '0');
  const formattedDay = day.padStart(2, '0');
  return `${year}-${formattedMonth}-${formattedDay}`;
}

const onPageChange = (event: any) => {
  // Update current page and refetch records when pagination changes
  page.value = event.page + 1;
  drawStore.getAllDraws(
    page.value,
    pageCount.value,
    formattedStartDate.value,
    formattedEndDate.value,
    globalFilter.value
  );
}
const onSearchChange = useDebounceFn(() => {
  if (globalFilter.value != "" && globalFilter.value.length >= 3) {
    drawStore.getAllDraws(
      page.value,
      pageCount.value,
      formattedStartDate.value,
      formattedEndDate.value,
      globalFilter.value
    );  }
}, 1000);
const getDrawsByDate = async (start: Date, end: Date) => {

  if (!start || !end) {
    console.log("Both start and end dates must be provided.");
    return;
  }
  const startDate = formatDate(start);
  const endDate = formatDate(end);
  formattedStartDate.value = formatFullDate(startDate); // "2024-06-04"
  formattedEndDate.value = formatFullDate(endDate);
  // Proceed with request if both dates are available
  try {
    drawStore.getAllDraws(
      page.value,
      pageCount.value,
      formattedStartDate.value,
      formattedEndDate.value,
      globalFilter.value
    );
  } catch (error) {
    console.error("Error fetching overview:", error);
  }
};
const viewDraw = (item: any) => {
  mainStore.setWinnerModal(true)
  entrieStore.getCustomerInfo(item.customer.id);
  drawStore.setDraw(item);
 }
const deleteRowAction = (item: any) => {
  mainStore.setDeleteModal(true)
  drawStore.setDraw(item);
}
</script>

<style></style>
