<template>
    <div class="card">
        <DataTable v-model:selection="selectedEntry" :value="filteredPrizesHistoryItems" dataKey="id"
            tableStyle="min-width: 50rem" stripedRows paginator :rows="10" :loading="loading"
            :globalFilterFields="['province', 'status']">
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
             <Column field="customer" header="Customer">
                <template #body="{ data }">
                    <div class="flex flex-col blur-sms select-none">
                        <span class="text-surface-700 dark:text-surface-0">{{
                            data.customer.network_operator
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
                        <span class="text-surface-700 dark:text-surface-0">{{
                            data.created_at.substring(0, 10)
                            }}</span>
                    </div>
                </template>
            </Column>
            <Column field="status" header="Status">
                <template #body="{ data }">
                    <div
                        class="rounded-full flex px-4 py-1.5 text-sm text-center items-center justify-center text-primary bg-primary/10">
                        {{ data.status ?? 'NONE' }}
                    </div>
                </template>
            </Column>
            <Column class="w-24 !text-end">
                <template #body="{ data }">
                    <Button icon="pi pi-ellipsis-v" @click="viewWinnerDetails(data)" severity="secondary" text
                        rounded></Button>
                </template>
            </Column>
        </DataTable>
    </div>

</template>

<script lang="ts" setup>
import type { WinnerType } from '~/types';
const props = defineProps<{
    title: string,
}>();
const reportStore = useReportStore();
const reportTab = computed(() => {
    return reportStore.reportTab;
});
const selectedEntry = ref<any>([]);

const prizeStore = usePrizeStore();

const prizesHistoryItems = computed(() => {
    return prizeStore.histories.slice().sort((a: any, b: any) => b.id - a.id);
});
const loading = computed(() => {
    return prizeStore.loading;
});



onMounted(() => {
    prizeStore.getAllHistoryPrizeDistribution();
});

const dates = ref();
const op = ref();



// Computed property for filtered items based on the date range
const filteredPrizesHistoryItems = computed(() => {
    if (!dates.value || dates.value.length !== 2) {
        return prizesHistoryItems.value; // Return all items if no valid date range
    }

    const [startDate, endDate] = dates.value;

    return prizesHistoryItems.value.filter((item: WinnerType) => {
        const claimedDate = new Date(item.claimed_date);
        return claimedDate >= startDate && claimedDate <= endDate;
    });
});

const viewWinnerDetails = (winner: any) => {
    prizeStore.setPrizeHistory(winner);
}




</script>

<style></style>