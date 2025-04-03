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


    </div>

    <div>

      <DataTable v-model:selection="selectedEntry" :value="filteredTypesItems" dataKey="id"
        tableStyle="min-width: 50rem" stripedRows paginator :rows="10" :loading="loading" :globalFilter="globalFilter"
        :globalFilterFields="['name', 'value', 'status']">
        <template #header>
          <div class="flex justify-between py-2">
            <div class="text-2xl font-semibold">Prize Types</div>
            <div class="flex gap-x-4">
              <IconField>
                <InputIcon>
                  <i class="pi pi-search" />
                </InputIcon>
                <InputText v-model="globalFilter" placeholder="Keyword Search" />
              </IconField>
              <DashboardPrizeAddType />
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
 
        <Column field="period" header="Period"></Column>
        <Column field="expiry_date" header="Expiry Date">
          <template #body="{ data }">
            <div class="flex flex-col">
              <span class="text-surface-700 text-nowrap dark:text-surface-0">{{
                formatDateStandard(data.expiry_date)
                }}</span>
            </div>
          </template>
        </Column>
        <Column field="name" header="Type Name">
          <template #body="{ data }">
            <div class="flex flex-col">
              <span class="text-surface-700 dark:text-surface-0">{{
                data.name
                }}</span>

            </div>
          </template>
        </Column>
        <Column field="category" header="Category">
          <template #body="{ data }">
            <div class="flex flex-col">
              <span class="text-surface-700 dark:text-surface-0">{{
                data.prize_category.name
                }}</span>
            </div>
          </template>
        </Column>
        <Column field="value" header="Prize Value">
          <template #body="{ data }">
            <div class="flex flex-col">
              <span class="text-surface-700 dark:text-surface-0">{{
                data.value
                }}</span>
            </div>
          </template>
        </Column>


        <Column field="elligibility" header="Elligibility"></Column>
        <Column field="trigger_by_system" header="Trigger by system"></Column>


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
              <Button icon="pi pi-pencil" @click="updateRow(data)" severity="secondary" text rounded></Button>
              <Button icon="pi pi-minus-circle" @click="deleteRow(data)" severity="secondary" text rounded></Button>
            </div>
          </template>
        </Column>
      </DataTable>

    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PrizeTypeData, WinnerType } from '~/types';

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
const items = ref([{ label: "Prize  Management" }, { label: "Types" }]);

const mainStore = useMainStore();

const globalFilter = ref("");
const selectedEntry = ref<any>([]);

const prizeStore = usePrizeStore();
const userStore = useUserStore();
const prizesItems = computed(() => {
  return prizeStore.prizeTypes.slice().sort((a: any, b: any) => b.id - a.id);
});
const { formatDateStandard } = useDateFormatter()

const loading = computed(() => {
  return prizeStore.loading;
});

const deleteRow = (item: any) => {
  mainStore.setDeleteModal(true);
  prizeStore.setCurrentType(item);
};
const updateRow = (data: any) => {
  mainStore.setUpdateModal(true);
  data.category_id = data.prize_category.id;
  prizeStore.setCurrentType(data);
};

onMounted(() => {
  prizeStore.getAllPrizeTypes();
});


const filteredTypesItems = computed(() => {
  if (!globalFilter.value) {
    return prizesItems.value; // Return all codes if no filter is applied
  }
  const filter = globalFilter.value.toLowerCase();
  return prizesItems.value.filter((item: PrizeTypeData) => {
    return (
      item.status.toLowerCase().includes(filter) ||
      item.name.toLowerCase().includes(filter) ||
      item.prize_category.name.toLowerCase().includes(filter)
    );
  });
});
</script>

<style></style>
