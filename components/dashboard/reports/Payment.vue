<template>
    <div class="card">
        <DataTable :value="transactions" dataKey="id" tableStyle="min-width: 50rem" stripedRows :row="5"
            :loading="loading" :globalFilter="globalFilter"
            :globalFilterFields="['user', 'email', 'department', 'status']">
            <template #header>
                <div>
                    <div class="flex justify-between">
                        <div class="card flex justify-center gap-3">
                            <div class="text-2xl font-semibold"> {{ props.title }}</div>
                        </div>

                        <div class="flex gap-3">

                            <DatePicker v-model="dates" @update:modelValue="getOverviewByDate(dates[0], dates[1])"
                                selectionMode="range" :manualInput="false" placeholder="01-01-2020 02-02-2021" />
                            <Button label="Exports" severity="secondary" @click="exportToExcel2" outlined
                                icon="pi pi-download" />
                        </div>




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
                        <span class="text-surface-700 dark:text-surface-0  text-nowrap">{{
                            formatDateStandard(data.created_at)
                            }}</span>
                    </div>
                </template>
            </Column>
            <Column field="trx_id" header="Transaction ID"></Column>
            <Column field="ref_no" header="RefNO"></Column>
            <Column field="transaction_type" header="Transaction Type"></Column>
            <Column field="amount" header="Amount"></Column>
            <Column field="phone" header="Phone"></Column>
            <Column field="initiated_by" header="Initiated By"></Column>
            <Column field="status" header="Status">
                <template #body="{ data }">
                    <div class="flex flex-col">
                        <span class="text-surface-700 dark:text-surface-0">{{
                            data.status
                            }}</span>
                    </div>
                </template>
            </Column>



        </DataTable>
        <Paginator :rows="pagination.limit" :totalRecords="pagination.total"
            :first="pagination.page * pagination.limit - 1">
            <template #start="slotProps">
                Page: {{ slotProps.state.page }}
                First: {{ slotProps.state.first }}
                Rows: {{ slotProps.state.rows }}
            </template>

        </Paginator>
    </div>

</template>

<script lang="ts" setup>
import * as XLSX from 'xlsx';


const props = defineProps<{
    title: string,
}>();
const globalFilter = ref(''); // Reactive property for search input

const reportStore = useTransactionStore();
const transactions = computed(() => {
    return reportStore.transactions.slice().sort((a: any, b: any) => b.id - a.id);
});

const loading = computed(() => {
    return reportStore.loading;
});

const { formatDateStandard } = useDateFormatter();


const page = ref(1)
const pageCount = ref(20)
onMounted(() => {
    reportStore.getAllTransactions();
});

const dates = ref();
const op = ref();

const pagination = computed(() => {
    return reportStore.pagination;
});

// Computed property for filtered items based on the date range
const filteredHistoryItems = computed(() => {
    if (!dates.value || dates.value.length !== 2) {
        return transactions.value; // Return all items if no valid date range
    }

    const [startDate, endDate] = dates.value;

    return transactions.value.filter((item: any) => {
        const claimedDate = new Date(item.claimed_date);
        return claimedDate >= startDate && claimedDate <= endDate;
    });
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
        reportStore.getAllTransactions(
            page.value,
            pageCount.value,
            formattedStartDate.value,
            formattedEndDate.value,
            globalFilter.value,
            "",
            "",
            ""
        );
    } catch (error) {
        console.error("Error fetching overview:", error);
    }
};

function exportToExcel2() {
    reportStore.getAllTransactions(null, null,null, null,null, null,null, null,"excel");
}

function exportToExcel(data: any) {

    // Create a new worksheet
    const worksheet = XLSX.utils.json_to_sheet([]);

    // Add header styles
    const headerStyles = {
        font: { bold: true, sz: 23 },
        fill: { fgColor: { rgb: "00B050" } }, // Green background
        border: {
            top: { style: "thin", color: { rgb: "000000" } }, // Black border
            bottom: { style: "thin", color: { rgb: "000000" } },
        },
        alignment: { horizontal: "center" },
    };

    // Add the header rows
    XLSX.utils.sheet_add_aoa(worksheet, [["ABC BANK"]], { origin: "A1" });
    worksheet["A1"].s = headerStyles;

    XLSX.utils.sheet_add_aoa(worksheet, [["100 Medan Merdeka Street Jakarta"]], { origin: "A2" });
    worksheet["A2"].s = headerStyles;

    XLSX.utils.sheet_add_aoa(worksheet, [["Phone: 021-987-6543, Fax: 021-987-6541"]], { origin: "A3" });
    worksheet["A3"].s = headerStyles;

    XLSX.utils.sheet_add_aoa(worksheet, [["Web: http://www.abcbank.com"]], { origin: "A4" });
    worksheet["A4"].s = headerStyles;

    // Transform headers to uppercase, remove underscores, and apply styles
    const headers = Object.keys(data[0]).map(header => ({
        v: header.replace(/_/g, " ").toUpperCase(),
        s: {
            font: { bold: true, sz: 16, color: { rgb: "#FFFFFF" } }, // White font color for contrast
            fill: { fgColor: { rgb: "#000000" } }, // Black background
            alignment: { horizontal: "center" }
        }
    }));
    XLSX.utils.sheet_add_aoa(worksheet, [headers.map(h => h.v)], { origin: "A6" });

    // Adding data starting from row 6
    XLSX.utils.sheet_add_json(worksheet, data, { origin: "A8", skipHeader: true });

    // Adjust column widths if necessary
    worksheet["!cols"] = [
        { wch: 10 }, // ID
        { wch: 15 }, // prize_id
        { wch: 15 }, // customer_id
        { wch: 20 }, // trx_id
        { wch: 15 }, // entry_id
        { wch: 15 }, // ref_no
        { wch: 15 }, // transaction_type
        { wch: 10 }, // amount
        { wch: 20 }, // phone
        { wch: 25 }, // mno
        { wch: 20 }, // initiated_by
        { wch: 10 }, // status
        { wch: 30 }, // error_message
        { wch: 20 }, // created_at
        { wch: 20 }, // updated_at
    ];

    // Create a new workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

    // Export the workbook to a file
    XLSX.writeFile(workbook, "Transaction_Report.xlsx");
}

</script>

<style></style>