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

      <SelectButton v-model="value" :options="options" optionLabel="value" optionValue="id" dataKey="value"
        aria-labelledby="custom" @change="changeReportType(value)">
      </SelectButton>
    </div>

    <div>
      <DashboardReportsUser title="User Report" v-if="reportTab == 1" />
      <DashboardReportsDraw title="Trigger Draw Report" v-if="reportTab == 4" />
      <DashboardReportsWinner title="Winners Report" v-if="reportTab == 5" />
      <DashboardReportsEntry title="Customer Entry Report" v-if="reportTab == 2" />
      <DashboardReportsPayment title="Payment Transactions Report" v-if="reportTab == 6" />
      <DashboardReportsDistribution title="Prize Distribution Report" v-if="reportTab == 3" />


    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  title: "Manage Entries",
  layout: "dashboard",
  middleware: "auth",
});
const value = ref(1);
const options = ref([
  { id: 1, value: 'User Report' },
  { id: 2, value: 'Customer Entry Report' },
  { id: 5, value: 'Winners Report' },
  { id: 6, value: 'Payment Transactions Report' }
]);
const home = ref({
  icon: "pi pi-home",
  label: "Home",
  route: "/dashboard",
});
const items = ref([{ label: "Reports" }]);
const reportStore = useReportStore();
const reportTab = computed(() => {
  return reportStore.reportTab;
});

const changeReportType = (item: any) => {
  reportStore.setReportTab(item)
}

</script>

<style></style>
