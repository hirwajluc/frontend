<template>
  <div class="card">
    <DataTable v-model:selection="selectedEntry" :value="prizesHistoryItems" dataKey="id" tableStyle="min-width: 50rem"
      stripedRows :loading="loading" :globalFilterFields="['province', 'status']">
      <template #header>
        <div class="flex justify-between items-end py-2">
          <div class="flex flex-col space-y-4">
            <div class="text-2xl font-semibold">Winners History</div>
 
          </div>
          <div class="  gap-x-4">
            <div class="card flex justify-center gap-3">
              
              <DatePicker v-model="dates" @update:modelValue="getWinnersByDate(dates[0], dates[1])"
                selectionMode="range" :manualInput="false" placeholder="01-01-2020 02-02-2021" />
            </div>
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
       <Column field="customer" header="Customer">
        <template #body="{ data }">
          <div class="flex flex-col blur-sm select-none">
            <span class="text-surface-700 dark:text-surface-0">{{
              data.customer.names
            }}</span>

          </div>
        </template>
      </Column>
      <Column field="code" header="Code">
        <template #body="{ data }">
          <div class="flex flex-col blur-sms select-none">
            <span class="text-surface-700 dark:text-surface-0">{{
              data.code
            }}</span>

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
              data.value
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

      <Column field="created_at" header="Claimed Date">
        <template #body="{ data }">
          <div class="flex flex-col ">
            <span class="text-surface-700 dark:text-surface-0 text-nowrap">{{
              formatDateStandard(data.created_at)
            }}</span>
          </div>
        </template>
      </Column>
      <Column field="status" header="Status">
        <template #body="{ data }">
          <div
            class="rounded-full flex px-4 py-1.5 text-sm text-center items-center justify-center text-primary bg-primary/10">
            {{ data.status ?? 'Won' }}
          </div>
        </template>
      </Column>
      
    </DataTable>
    <Paginator :rows="pagination.limit" :totalRecords="pagination.total" :first="pagination.page * pagination.limit - 1"
      >
      <template #start="slotProps">
        Page: {{ slotProps.state.page }}
        First: {{ slotProps.state.first }}
        Rows: {{ slotProps.state.rows }}
      </template>

    </Paginator>
  </div>

</template>

<script lang="ts" setup>
import type { WinnerType } from '~/types';

const props = defineProps<{
  title: string,
}>();
const globalFilter = ref('')
const page = ref(1);
const pageCount = ref(10);
  const prizeStore = usePrizeStore();

const selectedEntry = ref<any>([]);
const prizesHistoryItems = computed(() => {
  return prizeStore.histories.slice().sort((a: any, b: any) => b.id - a.id);
});
const loading = computed(() => {
  return prizeStore.loading;
});

const pagination = computed(() => {
  return prizeStore.pagination;
});
const { formatDateStandard } = useDateFormatter();

onMounted(() => {
  prizeStore.getAllHistoryPrizeDistribution();
});

const dates = ref();
const op = ref();


const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // getMonth() returns 0-11, so add 1
  const day = date.getDate();

  return `${year}-${month}-${day}`;
};

function formatFullDate(dateString: any) {
  const [year, month, day] = dateString.split('-');
  // Add leading zero if necessary
  const formattedMonth = month.padStart(2, '0');
  const formattedDay = day.padStart(2, '0');
  return `${year}-${formattedMonth}-${formattedDay}`;
}
const formattedStartDate = ref('')
const formattedEndDate = ref('')
const getWinnersByDate = async (start: Date, end: Date) => {

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
    prizeStore.getAllHistoryPrizeDistribution(
      page.value,
      pageCount.value,
      globalFilter.value,
      formattedStartDate.value,
      formattedEndDate.value,
      ""
    );
  } catch (error) {
    console.error("Error fetching overview:", error);
  }
};

</script>

<style></style>