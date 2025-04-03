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
    <!-- <DashboardEntriesViewEntry /> -->
    <div>
      <div class="card">
        <DataTable v-model:selection="selectedEntry" :value="users" dataKey="id" tableStyle="min-width: 50rem"
          stripedRows :row="5" :loading="loading" :globalFilter="globalFilter"
          :globalFilterFields="['user', 'email', 'department', 'status']">
          <template #header>
            <div class="flex justify-between">
              <IconField>
                <InputIcon>
                  <i class="pi pi-search" />
                </InputIcon>
                <InputText v-model="globalFilter" @update:model-value="onSearchChange" placeholder="Keyword Search" />
              </IconField>
              <div class="card flex justify-center gap-3">
                <Select v-model="user" :options="userFilters" filter @update:model-value="onSelectChange"
                  placeholder="Filter By User" class="w-full md:w-56">
                  <template #value="slotProps">
                    <div v-if="slotProps.value" class="flex items-center">
                      <img src="https://avatar.iran.liara.run/public" :class="`mr-2 `" style="width: 18px" />
                      <div>{{ slotProps.value.firstname + " " + slotProps.value.lastname }}</div>
                    </div>
                    <span v-else>
                      {{ slotProps.placeholder }}
                    </span>
                  </template>
                  <template #option="slotProps">
                    <div class="flex items-center">
                      <img src="https://avatar.iran.liara.run/public" :class="`mr-2 `" style="width: 18px" />

                      <div>{{ slotProps.option.firstname + " "+ slotProps.option.lastname }}</div>
                    </div>
                  </template>
                </Select>
                <DatePicker v-model="dates" @update:modelValue="getOverviewByDate(dates[0], dates[1])"
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
            <div class="custom-loader-overlay">

              <div class="custom-loader space-y-6 flex flex-col">
                <div class="loader"></div>
                <p>Loading data, please wait...</p>
              </div>
            </div>
          </template>

          <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
          <Column field="created_at" header="Timestamp">
            <template #body="{ data }">
              <div class="flex flex-col">
                <span class="text-surface-700 dark:text-surface-0">{{
                  formatDateStandard(data.created_at)
                  }}</span>
              </div>
            </template>
          </Column>
          <Column field="action_type" header="Action Type">
            <template #body="{ data }">
              <div class="flex flex-col">
                <span class="text-surface-700 dark:text-surface-0">{{
                  data.activity_type
                  }}</span>
              </div>
            </template>
          </Column>
          <Column field="user" header="Admin Name">
            <template #body="{ data }">
              <div class="flex flex-col">
                <span class="text-surface-700 dark:text-surface-0">{{
                  data.user.fname + " " + data.user.lname
                  }}</span>
                <span class="text-[11px] text-nowrap">Phone: {{
                  data.user.phone + " | Email: " + data.user.email
                  }}</span>
              </div>
            </template>
          </Column>
          <Column field="ip_address" header="IP Address">
            <template #body="{ data }">
              <div class="flex flex-col">
                <span class="text-surface-700 dark:text-surface-0">{{
                  data.ip_address
                  }}</span>
              </div>
            </template>
          </Column>
          <Column field="user_agent" header="User Agent">
            <template #body="{ data }">
              <div class="flex flex-col">
                <span class="text-surface-700 dark:text-surface-0">{{
                  data.user_agent
                  }}</span>
              </div>
            </template>
          </Column>
          <Column field="description" header="Description">
            <template #body="{ data }">
              <small class="p-1 font-medium text-xs ">
                {{ data.description.substring(0, 60) }}
              </small>
            </template>
          </Column>
          <Column field="status" header="Status">
            <template #body="{ data }">
              <div class="font-bold flex   py-1.5 text-sm  ">
                {{ data.status }}
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
import type { AccountData } from '~/types';
import { useDebounceFn } from "@vueuse/core";

definePageMeta({
  title: "Activity Logs",
  layout: "dashboard",
  middleware: "auth",
});
const home = ref({
  icon: "pi pi-cog",
  label: "Settings",
  route: "/dashboard",
});
const items = ref([{ label: "Activity Logs" }]);
const globalFilter = ref(''); // Reactive property for search input
const userStore = useUserStore();
const users = computed(() => {
  return userStore.activity_logs.slice().sort((a: any, b: any) => b.id - a.id);
});
const page = ref(1)
const pageCount = ref(20)
const selectedEntry = ref<any>([]);
const { formatDateStandard } =  useDateFormatter()
const loading = computed(() => {
  return userStore.loading;
});
const userFilters = computed(() => {
  return userStore.users;
});
const dates = ref()
const pagination = computed(() => {
  return userStore.pagination;
});

const onSearchChange = useDebounceFn(() => {
  if (globalFilter.value != "" && globalFilter.value.length >= 3 ){
    userStore.getUserActivityLogs(user.value?.id, formattedStartDate.value, formattedEndDate.value, globalFilter.value, page.value, pageCount.value);
  }
}, 1000);

const onPageChange = (event: any) => {
  // Update current page and refetch records when pagination changes
  page.value = event.page + 1;
  userStore.getUserActivityLogs(user.value?.id, formattedStartDate.value, formattedEndDate.value, globalFilter.value, page.value, pageCount.value);

}

const onSelectChange = (event: any) => {

  userStore.getUserActivityLogs(user.value?.id, formattedStartDate.value, formattedEndDate.value, globalFilter.value, page.value, pageCount.value);

}

onMounted(() => {
  userStore.getUserActivityLogs();
  userStore.getAllUsers();
});
 
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
const user = ref<AccountData>()

const getOverviewByDate = async (start: Date, end: Date) => {

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
    userStore.getUserActivityLogs(user.value?.id, formattedStartDate.value, formattedEndDate.value, globalFilter.value, page.value, pageCount.value);
  } catch (error) {
    console.error("Error fetching overview:", error);
  }
};
</script>

<style scoped>
.custom-loader-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.2);
  /* Adjust opacity here (0.4 for 40% opacity) */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.custom-loader {
  text-align: center;
}
</style>