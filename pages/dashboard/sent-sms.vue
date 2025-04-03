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
        <DataTable v-model:selection="selectedMessages" :value="messages" dataKey="id" tableStyle="min-width: 50rem"
          stripedRows :loading="loading" :globalFilter="globalFilter"
          :globalFilterFields="['user', 'email', 'department', 'status']">
          <template #header>
            <div class="flex justify-between">
              <div class="text-2xl font-semibold">Messages Sent</div>

              <div class="card flex justify-center gap-x-3">
                <Select v-model="messageType" :options="messageTypeItems" optionLabel="name"
                  @update:model-value="onSelectChange" placeholder="Filter by SMS Type" class="w-full md:w-48">
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
                <DatePicker v-model="dates" @update:modelValue="getEntryByDate(dates[0], dates[1])"
                  selectionMode="range" iconDisplay="input" :manualInput="false" placeholder="01-01-2020 02-02-2021" />
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
          <Column field="phone" header="Receiver phone number">
            <template #body="{ data }">
              <div class="flex flex-col">
                <span class="text-surface-700 dark:text-surface-0 text-nowrap">{{
                  data.phone
                }}</span>
              </div>
            </template>
          </Column>
          <Column field="message_type" header="Message type">
            <template #body="{ data }">
              <small class="p-1 font-medium text-xs ">
                {{ data.message_type }}
              </small>
            </template>
          </Column>
          <Column field="message" header="Message">
            <template #body="{ data }">
              <small class="p-1 font-medium text-xs ">
                {{ data.message }}
              </small>
            </template>
          </Column>
          <Column field="created_at" header="Time">
            <template #body="{ data }">
              <div class="flex flex-col">
                <span class="text-surface-700 dark:text-surface-0 text-nowrap">{{
                  formatDateStandard(data.created_at)
                  }}</span>
              </div>
            </template>
          </Column>
          <Column field="status" header="Status">
            <template #body="{ data }">
              <div class="font-bold flex py-1.5 text-sm">
                {{ data.status }}
              </div>
            </template>
          </Column>

          <Column   class="!text-end">
            <template #body="{ data }">
              <div class="flex items-center gap-x-4">
                <Button v-if="data.status == 'FAILED'" icon="pi pi-refresh" :loading="isResending" :disabled="isResending" label="Resend" text @click="resendFailedSMS(data.id)" />
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
import { useMessageStore } from '~/stores/sms/sms.store';

definePageMeta({
  title: "Activity Logs",
  layout: "dashboard",
  middleware: "auth",
});
const mainStore = useMainStore();
const home = ref({
  icon: "pi pi-cog",
  label: "Settings",
  route: "/dashboard",
});
const items = ref([{ label: "SMS Sent" }]);
const formattedStartDate = ref('')
const formattedEndDate = ref('')
const globalFilter = ref('')
const page = ref(1);
const pageCount = ref(10);
const dates = ref();
const messageStore = useMessageStore()
const messages = computed(() => {
  return messageStore.messages
});

const selectedMessages = ref<any>([]);

const loading = computed(() => {
  return messageStore.loading;
});

onMounted(() => {
  messageStore.GetMessages();
});
onUnmounted(() => messageStore.setMessages([]))
const pagination = computed(() => {
  return messageStore.pagination;
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

const messageType = ref()

const messageTypeItems = ref([
  { id: "prize_won", name: "Prize Won" },
  { id: "no_prize", name: "No Prize" },
  { id: "account_password", name: "Account Password" },
  { id: "reset_password_otp", name: "Reset Password OTP" },
])


const onPageChange = (event: any) => {
  // Update current page and refetch records when pagination changes
  page.value = event.page + 1;
  messageStore.GetMessages(
    page.value,
    pageCount.value,
    formattedStartDate.value,
    formattedEndDate.value,
    messageType.value?.id,
  );
}

const onSelectChange = (event: any) => {
  messageStore.GetMessages(
    page.value,
    pageCount.value,
    formattedStartDate.value,
    formattedEndDate.value,
    messageType.value?.id,
  );
}
const { formatDateStandard } = useDateFormatter()

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
    messageStore.GetMessages(
      page.value,
      pageCount.value,
      formattedStartDate.value,
      formattedEndDate.value,
      messageType.value?.id,
    );
  } catch (error) {
    console.error("Error fetching overview:", error);
  }
};

const resendFailedSMS = async (id: any) => {
  await messageStore.resendMessage(id)
}

const isResending = computed(() => {
  return messageStore.resending;
});

</script>

<style></style>
