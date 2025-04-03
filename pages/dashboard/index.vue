<template>
  <div class="space-y-4">
    <DashboardHeading />
    <!-- <div class=" p-4 rounded-lg border border-border">
      <div class="font-bold text-green-700 text-xl pb-4">BALANCE</div>
      <DashboardBalanceCard />
    </div> -->
    <DashboardStatistic />
    <DashboardCodesAddCode />
    <EntryMetrics />
    <DashboardLineChart />
  </div>
</template>

<script lang="ts" setup>
 
definePageMeta({
  title: "Dashboard",
  layout: "dashboard",
  middleware: "auth",
});
const entrieStore = useEntriesStore();
const prizeStore = usePrizeStore();

onMounted(() => {
  prizeStore.getPrizeOverview()
  prizeStore.getPrizeOverviewV2()
  entrieStore.getAllEntries();
})
</script>

<style></style>
