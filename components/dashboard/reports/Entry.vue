<template>
  <div class="card">
    <DataTable v-model:selection="selectedEntry" :value="filteredEntryItems" dataKey="id" tableStyle="min-width: 50rem"
      stripedRows paginator :rows="10" :loading="loading" :globalFilter="globalFilter"
      :globalFilterFields="['customer', 'status']">
      <template #header>
        <div class="flex justify-between gap-4">
          <div class="text-2xl font-semibold"> {{ props.title }}</div>
          <div class="flex gap-x-4">
            <DatePicker v-model="dates" selectionMode="range" @update:modelValue="getEntryByDate(dates[0], dates[1])"
              dateFormat="dd/mm/yy" :manualInput="false" placeholder="Select Date Range" iconDisplay="input" showIcon />

            <Button label="Exports" severity="secondary" outlined icon="pi pi-download" />


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
      <Column field="id" header="Entry ID"></Column>
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
          <div class="flex blur-sm select-none flex-col">
            <span class="text-surface-700 dark:text-surface-0">{{
              data.code.code
              }}</span>
          </div>
        </template>
      </Column>
      <Column field="customer" header="Location">
        <template #body="{ data }">
          <div class="flex flex-col">

            <div class="text-surface-500 dark:text-surface-0">{{ data.customer.province.name }} - {{
              data.customer.district.name }} </div>
          </div>
        </template>
      </Column>

    </DataTable>
  </div>

</template>

<script lang="ts" setup>
import type { CustomerType } from '~/types';
const props = defineProps<{
  title: string,
}>();
const reportStore = useReportStore();
const reportTab = computed(() => {
  return reportStore.reportTab;
});
 
const globalFilter = ref(''); // Reactive property for search input
const { formatDateStandard } = useDateFormatter();


const selectedEntry = ref<any>([]);

const entrieStore = useEntriesStore();

const entriesItems = computed(() => {
  return entrieStore.entries;
});
const loading = computed(() => {
  return entrieStore.loading;
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
 
const dates = ref();
const selectedProvince = ref();
const networkOperator = ref();
const page = ref(1)
const pageCount = ref(20)
onMounted(() => {
  // Fetch entries on mount
  entrieStore.getAllEntries();
})

const networkOperators = ref([
  "MTN", "AIRTEL"
])

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

const getEntryByDate = async (start: Date, end: Date) => {

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
    entrieStore.getAllEntries(
      page.value,
      pageCount.value,
      formattedStartDate.value,
      formattedEndDate.value,
      selectedProvince.value?.id,
      networkOperator.value
    );
  } catch (error) {
    console.error("Error fetching overview:", error);
  }
};

const onNetworkChange = () => {

  entrieStore.getAllEntries(
    page.value,
    pageCount.value,
    formattedStartDate.value,
    formattedEndDate.value,
    selectedProvince.value?.id,
    networkOperator.value
  );
};
</script>

<style>

</style>