<template>
  <div class="gap-4 ">
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
    <DashboardEntriesViewEntry />
    <div>
      <div class="card">
        <DataTable v-model:selection="selectedEntry" :value="entriesItems" dataKey="id" tableStyle="min-width: 50rem"
          stripedRows :loading="loading" :globalFilter="globalFilter" :globalFilterFields="['customer', 'status']">
          <template #header>
            <div class="flex justify-between gap-4">
              <div class="text-2xl font-semibold">List of Customer Entries</div>
              <div class="card flex justify-center gap-x-3">
                <Select v-model="selectedProvince" :options="provinces" optionLabel="name"
                  @update:model-value="onSelectChange" placeholder="Filter by Province" class="w-full md:w-48">
                  <template #value="slotProps">
                    <div v-if="slotProps.value" class="flex items-center">

                      <div>{{ slotProps.value.name }}</div>
                    </div>
                    <span v-else>
                      {{ slotProps.placeholder }}
                    </span>
                  </template>
                  <template #option="slotProps">
                    <div class="flex items-center">

                      <div>{{ slotProps.option.name }}</div>
                    </div>
                  </template>
                </Select>
                <Select v-model="networkOperator" :options="networkOperators" @update:model-value="onNetworkChange"
                  placeholder="Filter by Network Operator" class="w-full md:w-48">

                </Select>
                <DatePicker v-model="dates" @update:modelValue="getEntryByDate(dates[0], dates[1])"
                  selectionMode="range" :manualInput="false" placeholder="01-01-2020 02-02-2021" />
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

          <Column class="w-24 !text-end">
            <template #body="{ data }">
              <Button icon="pi pi-ellipsis-v" @click="viewEntry(data)" severity="secondary" text rounded>View</Button>

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
const items = ref([{ label: "Manage Entries" }]);
const formattedStartDate = ref('')
const formattedEndDate = ref('')
const globalFilter = ref('')
const page = ref(1);
const pageCount = ref(10);
const dates = ref();

const selectedEntry = ref<any>([]);

const entrieStore = useEntriesStore();

const entriesItems = computed(() => {
  return entrieStore.entries.slice().sort((a: any, b: any) => b.id - a.id);
});
const loading = computed(() => {
  return entrieStore.loading;
});
const { formatDateStandard } = useDateFormatter()


onMounted(() => {
  entrieStore.getAllEntries();
  entrieStore.getAllProvinces();
});

const viewEntry = (data: any) => {
  mainStore.setEntriesModal(true)
  entrieStore.getCustomeEntry(data.id);
};

const pagination = computed(() => {
  return entrieStore.pagination;
});
const provinces = computed(() => {
  return entrieStore.provinces;
})
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

const networkOperators = ref([
  "MTN", "AIRTEL"
])


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

const onPageChange = (event: any) => {
  // Update current page and refetch records when pagination changes
  page.value = event.page + 1;
  entrieStore.getAllEntries(
    page.value,
    pageCount.value,
    formattedStartDate.value,
    formattedEndDate.value,
    selectedProvince.value?.id,
    networkOperator.value
  );
}

const onSelectChange = (event: any) => {
  entrieStore.getAllEntries(
    page.value,
    pageCount.value,
    formattedStartDate.value,
    formattedEndDate.value,
    selectedProvince.value?.id,
    networkOperator.value
  );
}

const selectedProvince = ref();
const networkOperator = ref();

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
</script>

<style></style>
