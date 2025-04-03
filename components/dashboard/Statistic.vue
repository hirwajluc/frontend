<template>
  <div class="lg:grid grid-cols-4 gap-4">
    <DashboardCard title="Payouts" leftTitle="Expected" :leftValue="prizeOverview.payouts.expected" rightTitle="Actual"
      :rightValue="prizeOverview.payouts.actual" :isOne="false" />

    <DashboardCard title="Winners" leftTitle="Paid" :leftValue="prizeOverview.winners.paid" rightTitle="Pending"
      :rightValue="prizeOverview.winners.pending" :isOne="false" />

    <DashboardCard title="Daily Rewards" :leftTitle="prizeOverview.rewards.distributed+' out of '+prizeOverview.rewards.total" :leftValue="0" rightTitle="rewards"
      :rightValue="0" :isOne="true" />

    <DashboardCard title="Total Entries" leftTitle="Expected" :leftValue="totalEntries" rightTitle="Actual"
      :rightValue="totalEntries" :isOne="true" />

  </div>
</template>

<script lang="ts" setup>
import { usePrizeOverview } from '@/composables/usePrizeOverview'

const { calculateOverview } = usePrizeOverview()
const prizeStore = usePrizeStore()
const prizeOverview = computed(() => prizeStore.prizeOverviewV2);
const totalEntries = computed(() => prizeStore.totalEntries);


</script>

<style></style>