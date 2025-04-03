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
        <DashboardWinnerPayWaiting />
        <div>
            <div class="card">
                <DataTable v-model:selection="selectedEntry" :value="transactions" dataKey="id"
                    tableStyle="min-width: 50rem" stripedRows :row="5" :loading="loading" :globalFilter="globalFilter"
                    :globalFilterFields="['user', 'email', 'department', 'status']">
                    <template #header>
                        <div>
                            <div class="flex justify-between">
                                <div class="card flex justify-center gap-3">
                                    <Select v-model="transaction" :options="transactionFilters"
                                        @update:model-value="onSelectChange" placeholder="Filter By User">
                                        <template #value="slotProps">
                                            <div v-if="slotProps.value" class="flex items-center">

                                                <div>{{ slotProps.value.label }}</div>
                                            </div>
                                            <span v-else>
                                                {{ slotProps.placeholder }}
                                            </span>
                                        </template>
                                        <template #option="slotProps">
                                            <div class="flex items-center">

                                                <div>{{ slotProps.option.label }}
                                                </div>
                                            </div>
                                        </template>
                                    </Select>
                                    <IconField>
                                        <InputIcon>
                                            <i class="pi pi-search" />
                                        </InputIcon>
                                        <InputText v-model="globalFilter" @keyup.enter="onSearchChange"
                                            :placeholder="`Search  ${transaction?.label ?? ``}`" />
                                    </IconField>
                                </div>

                                <div class="flex gap-3">
                                    <Select v-model="transactionStatus" :options="transactionStatusFilters"
                                        @update:model-value="onSelectStatusChange(transactionStatus)"
                                        placeholder="Filter By Status">
                                        <template #value="slotProps">
                                            <div v-if="slotProps.value" class="flex items-center">

                                                <div>{{ slotProps.value.label }}</div>
                                            </div>
                                            <span v-else>
                                                {{ slotProps.placeholder }}
                                            </span>
                                        </template>
                                        <template #option="slotProps">
                                            <div class="flex items-center">

                                                <div>{{ slotProps.option.label }}
                                                </div>
                                            </div>
                                        </template>
                                    </Select>
                                    <DatePicker v-model="dates"
                                        @update:modelValue="getOverviewByDate(dates[0], dates[1])" selectionMode="range"
                                        :manualInput="false" placeholder="01-01-2020 02-02-2021" />
                                </div>




                            </div>

                            <div v-if="transactionStatus?.label == 'WAITING' && isApproving && hasWaitingStatus"
                                class="border  p-4 rounded mt-2 flex items-center  gap-x-12">
                                <div>
                                    <div class="flex gap-8">
                                        <div>

                                            <small>Total winners</small>
                                            <div class="font-semibold text-xl"> {{ transactions.length }} </div>
                                        </div>
                                        <div>

                                            <small> MTN Amount</small>
                                            <div class="font-semibold text-xl"> {{ totalMTNWaitingAmount }} FRW</div>
                                        </div>
                                        <div>

                                            <small> AIRETL Amount</small>
                                            <div class="font-semibold text-xl"> {{ totalAIRTELWaitingAmount }} FRW</div>
                                        </div>

                                    </div>
                                    <div class="text-sm text-gray-400 mt-1">Winners wating for their prize distributions
                                    </div>
                                </div>
                                <Button label="Make Payment" icon="pi pi-send" class="flex h-12" iconPos="right"
                                    @click="approveWaitingPayment()" />

                            </div>
                            <div v-if="transactionStatus?.label == 'FAILED' && isApproving && hasFailedStatus"
                                class="border  p-4 rounded mt-2 flex items-center  gap-x-12">
                                <div>
                                    <div class="flex gap-8">
                                        <div>

                                            <small>Total winners</small>
                                            <div class="font-semibold text-xl"> {{ transactions.length }} </div>
                                        </div>
                                        <div>

                                            <small> MTN Amount</small>
                                            <div class="font-semibold text-xl"> {{ totalMTNFailedAmount }} FRW</div>
                                        </div>

                                        <div>

                                            <small> AIRTEL Amount</small>
                                            <div class="font-semibold text-xl"> {{ totalAIRTELFailedAmount }} FRW</div>
                                        </div>

                                    </div>
                                    <div class="text-sm text-gray-400 mt-1">Winners failed for their prize distributions
                                    </div>
                                </div>
                                <Button label="Make Payment" icon="pi pi-send" class="flex h-12" iconPos="right"
                                    @click="approveFailedPayment()" />

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

                    <Column field="created_at" header="Timestamp">
                        <template #body="{ data }">
                            <div class="flex flex-col">
                                <span class="text-surface-700 dark:text-surface-0">{{
                                    formatDateStandard(data.created_at)
                                    }}</span>
                            </div>
                        </template>
                    </Column>
                    <Column field="trx_id" header="Transaction ID"></Column>
                    <Column field="ref_no" header="RefNO"></Column>
                    <Column field="transaction_type" header="Transaction Type"></Column>
                    <Column field="mno" header="Network Operator"></Column>
                    <Column field="amount" header="Amount"></Column>
                    <Column field="phone" header="Phone"></Column>
                    <Column field="initiated_by" header="Initiated By"></Column>
                    <Column field="status" header="Status">
                        <template #body="{ data }">
                            <div class="flex flex-col">
                                <span :class="statusClr(data.status)">{{
                                    data.status
                                    }}</span>
                            </div>
                        </template>

                    </Column>
                    <Column field="actions" header=" ">
                        <template #body="{ data }">
                            <div class="flex flex-col">
                                <Button v-if="data.status == 'WAITING'" label="Send "
                                    @click="approveSinglePayment(data.id)" icon="pi pi-send" class="h-10"></Button>
                                <Button v-if="data.status == 'FAILED'" label="Resend "
                                    @click="resendSinglePayment(data.id)" icon="pi pi-refresh" class="h-10"></Button>
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
    title: "Payment transactions",
    layout: "dashboard",
    middleware: "auth",
});
const home = ref({
    icon: "pi pi-cog",
    label: "Settings",
    route: "/dashboard",
});
const items = ref([{ label: "Payment transactions" }]);
const globalFilter = ref(''); // Reactive property for search input
const userStore = useTransactionStore();
const mainStore = useMainStore();
const transactions = computed(() => {
    return userStore.transactions.slice().sort((a: any, b: any) => b.id - a.id);
});

// Calculate the total amount
const totalAIRTELWaitingAmount = computed(() => {
    return transactions.value.reduce((total, transaction) => {
        return transaction.status === "WAITING" && transaction.mno === "AIRTEL"
            ? total + transaction.amount
            : total;
    }, 0);
});

const totalMTNWaitingAmount = computed(() => {
    return transactions.value.reduce((total, transaction) => {
        return transaction.status === "WAITING" && transaction.mno === "MTN"
            ? total + transaction.amount
            : total;
    }, 0);
});


const totalAIRTELFailedAmount = computed(() => {
    return transactions.value.reduce((total, transaction) => {
        return transaction.status === "FAILED" && transaction.mno === "AIRTEL"
            ? total + transaction.amount
            : total;
    }, 0);
});

const totalMTNFailedAmount = computed(() => {
    return transactions.value.reduce((total, transaction) => {
        return transaction.status === "FAILED" && transaction.mno === "MTN"
            ? total + transaction.amount
            : total;
    }, 0);
});

const bulkTrxIds = computed(() => {
    return transactions.value.filter((transaction) => transaction.status === "WAITING").map((transaction) => transaction.id);
});

const bulkFailTrxIds = computed(() => {
    return transactions.value.filter((transaction) => transaction.status === "FAILED").map((transaction) => transaction.id);
});

const page = ref(1)
const pageCount = ref(20)
const selectedEntry = ref<any>([]);

const loading = computed(() => {
    return userStore.loading;
});
const isApproving = computed(() => {
    return userStore.isApproving;
});
const transactionFilters = ref([
    { label: "Phone number", id: "phone" },
    { label: "Transaction ID", id: "trx_id" },
    { label: "Reference Number", id: "ref_no" },
]);

const transactionStatusFilters = ref([
    { label: "WAITING", id: "WAITING" },
    { label: "PENDING", id: "PENDING" },
    { label: "FAILED", id: "FAILED" },
    { label: "SUCCESS", id: "SUCCESS" },
]);
const dates = ref()
const transactionType = ref("")
const transactionStatus = ref("")
const transaction = ref()
const selectType = ref("")
const pagination = computed(() => {
    return userStore.pagination;
});

const onSearchChange = () => {
    if (globalFilter.value != "" && globalFilter.value.length >= 5) {
        userStore.getAllTransactions(
            page.value,
            pageCount.value,
            formattedStartDate.value,
            formattedEndDate.value,
            globalFilter.value,
            transactionType.value,
            `${selectType.value + globalFilter.value}`,
            transactionStatus.value?.id
        );
    }
};

const onPageChange = (event: any) => {
    // Update current page and refetch records when pagination changes
    page.value = event.page + 1;
    userStore.getAllTransactions(
        page.value,
        pageCount.value,
        formattedStartDate.value,
        formattedEndDate.value,
        globalFilter.value,
        transactionType.value,
        `${selectType.value + globalFilter.value}`,
        transactionStatus.value?.id
    );
}

const onSelectChange = (type: any) => {
    selectType.value = `${type?.id}=`;
}

const onSelectStatusChange = (type: any) => {

    userStore.getAllTransactions(
        page.value,
        pageCount.value,
        formattedStartDate.value,
        formattedEndDate.value,
        globalFilter.value,
        transactionType.value,
        `${selectType.value + globalFilter.value}`,
        transactionStatus.value?.id
    );


}




onMounted(() => {
    userStore.getAllTransactions();
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
        userStore.getAllTransactions(
            page.value,
            pageCount.value,
            formattedStartDate.value,
            formattedEndDate.value,
            globalFilter.value,
            transactionType.value,
            `${selectType.value + globalFilter.value}`,
            transactionStatus.value?.id
        );
    } catch (error) {
        console.error("Error fetching overview:", error);
    }
};
const { formatDateStandard } = useDateFormatter();

const statusClr = (status: any) => {
    switch (status) {
        case 'WAITING':
            return 'text-blue-500';
        case 'PENDING':
            return 'text-orange-500';
        case 'FAILED':
            return 'text-red-500';
        case 'COMPLETED':
            return 'text-green-500';
        default:
            return 'text-gray-500';
    }
}

// Check if any transaction has "waiting" status
const hasWaitingStatus = computed(() =>
    transactions.value.some((transaction: any) => transaction.status.toLowerCase() === 'waiting')
)
const hasFailedStatus = computed(() =>
    transactions.value.some((transaction: any) => transaction.status.toLowerCase() === 'failed')
)

const approveWaitingPayment = () => {
    mainStore.setApprovalModal(true);
    userStore.setTransactionIds(bulkTrxIds.value);
    userStore.setBulk(true);
    userStore.setFailed(false);
}
const approveFailedPayment = () => {
    mainStore.setApprovalModal(true);
    userStore.setTransactionIds(bulkFailTrxIds.value);
    userStore.setBulk(true);
    userStore.setFailed(true);
}

const approveSinglePayment = (id: any) => {
    mainStore.setApprovalModal(true);
    userStore.setTransactionIds(id);
    userStore.setBulk(false);
    userStore.setFailed(false);
}



const resendSinglePayment = (id: any) => {
    mainStore.setApprovalModal(true);
    userStore.setTransactionIds(id);
    userStore.setBulk(false);
    userStore.setFailed(true);
}
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