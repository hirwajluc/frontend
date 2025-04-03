<template>
  <div class="card">
    <DataTable v-model:selection="selectedEntry" :value="filteredUsers" dataKey="id" tableStyle="min-width: 50rem"
      stripedRows paginator :rows="10" :loading="loading" :globalFilterFields="['province', 'status']">
      <template #header>
        <div class="flex justify-between py-2">
          <div class="text-2xl font-semibold"> {{ props.title }}</div>
          <div class="flex gap-x-4">
            <DatePicker v-model="dates" selectionMode="range" dateFormat="dd/mm/yy" :manualInput="false"
              placeholder="Select Date Range" iconDisplay="input" showIcon />

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

      <Column field="user" header="USER">
        <template #body="{ data }">
          <div class="flex flex-col">
            <span class="text-surface-700 dark:text-surface-0"> {{
              data.firstname + " " + data.lastname
            }}</span>

          </div>
        </template>
      </Column>
      <Column field="phone" header="Phone">
        <template #body="{ data }">
          <div class="flex flex-col">
            <span class="text-surface-700 dark:text-surface-0">{{
              data.phone
            }}</span>
          </div>
        </template>
      </Column>


      <Column field="can_add_codes" header="ACCESS LEVEL">
        <template #body="{ data }">
          <div class="grid grid-cols-2 gap-2">
            <small class="border rounded-sm border-border p-1 font-semibold text-[10px] " v-if="data.can_add_user">
              CAN ADD USER
            </small>
            <small class="border rounded-sm border-border p-1 font-semibold text-[10px] " v-if="data.can_add_codes">
              CAN ADD CODES
            </small>
            <small class="border rounded-sm border-border p-1 font-semibold text-[10px] " v-if="data.can_view_logs">
              CAN VIEW LOGS
            </small>
            <small class="border rounded-sm border-border p-1 font-semibold text-[10px] " v-if="data.can_trigger_draw">
              CAN TRIGGER DRAW
            </small>
          </div>


        </template>
      </Column>
      <Column field="email" header="Email">
        <template #body="{ data }">
          <div class=" flex px-4 py-1.5 text-sm text-center items-center justify-center text-primary ">
            {{ data.email }}
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
          <Button icon="pi pi-ellipsis-v" severity="secondary" text rounded></Button>
        </template>
      </Column>
    </DataTable>
  </div>

</template>

<script lang="ts" setup>
const props = defineProps<{
  title: string,
}>();
const reportStore = useReportStore();



const reportItems = computed(() => {
  return reportStore.reports;
});

const globalFilter = ref(''); // Reactive property for search input
const userStore = useUserStore();
const users = computed(() => {
  return userStore.users.slice().sort((a: any, b: any) => b.id - a.id);
});

const selectedEntry = ref<any>([]);
const { formatDateStandard } = useDateFormatter();

const loading = computed(() => {
  return userStore.loading;
});

onMounted(() => {
  userStore.getAllUsers();
});
// Method to handle search input// Computed property for filtered codes based on the search input
const filteredUsers = computed(() => {
  if (!globalFilter.value) {
    return users.value; // Return all codes if no filter is applied
  }
  const filter = globalFilter.value.toLowerCase();
  return users.value.filter((code: any) => {
    return (
      code.id.toLowerCase().includes(filter) ||
      code.status.toLowerCase().includes(filter) ||
      code.phone.toLowerCase().includes(filter) ||
      code.email.toLowerCase().includes(filter) ||
      code.firstname.toLowerCase().includes(filter) ||
      code.lastname.toLowerCase().includes(filter)
    );
  });
});


const dates = ref();

</script>

<style></style>