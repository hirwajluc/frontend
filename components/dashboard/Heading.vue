<template>
  <div class="lg:flex pb-4  max-sm:space-y-2 items-center justify-between">
    <div >
      <div class="font-light text-lg text-gray-700">Welcome, </div>
      <div class="font-semibold text-3xl text-gray-700">{{ fullname }}</div>
    </div>

    <div class="flex space-x-4 items-center">
      <div class="flex text-xl font-semibold">Filter By Date</div>
       <DatePicker v-model="dates" @update:modelValue="getOverviewByDate(dates[0],dates[1])" selectionMode="range" :manualInput="false"
        placeholder="01-01-2020 02-02-2021" />
      <!-- <Button severity="secondary" outlined :label="selectedMember ? selectedMember.title : 'Filter Province'"
        @click="toggle" class="min-w-48" icon="pi pi-sliders-h" /> -->

      <Popover ref="op">
        <div class="flex flex-col gap-4">
          <div>
            <span class="font-medium block mb-2">Rwanda Province</span>
            <ul class="list-none p-0 m-0 flex flex-col">
              <li v-for="item in province" :key="item.title"
                class="flex items-center px-2 py-1 group hover:bg-card cursor-pointer rounded-border"
                @click="selectMember(item)">
                <div>
                  <span class="font-normal text-sm group-hover:text-primary">{{
                    item.title
                    }}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </Popover>
    </div>
  </div>
</template>

<script lang="ts" setup>
const dates = ref<Date[]>([]);
onMounted(() => {
  //set default dates to today
  const today = new Date();
  dates.value = [today, today];
});
const op = ref();
const prizeStore = usePrizeStore()
const chartStore = useChartStore();


const selectedMember = ref<ProvinceType>();
const province = ref([
  { id: 1, title: "Kigali City" },
  { id: 2, title: "Northern Province" },
  { id: 3, title: "Eastern Province" },
  { id: 4, title: "Southern Province" },
  { id: 5, title: "Western Province" },
]);
export interface ProvinceType {
  id: number;
  title: string;
}
const toggle = (event: any) => {
  op.value.toggle(event);
};
const selectMember = (member: any) => {
  selectedMember.value = member;
  op.value.hide();
};

const authStore = useAuthStore();
const user = computed(() => {
  return authStore.user;
});

const fullname = computed(() => {
  return user.value.firstname + " " + user.value.lastname || "User";
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

const getOverviewByDate = async (start: Date, end: Date) => {
  if (!start || !end) {
    console.log("Both start and end dates must be provided.");
    return;
  }
  const startDate = formatDate(start);
  const endDate = formatDate(end);
  const formattedStartDate = formatFullDate(startDate); // "2024-06-04"
  const formattedEndDate = formatFullDate(endDate);
  // Proceed with request if both dates are available
  try {
    await prizeStore.getPrizeOverview(formattedStartDate, formattedEndDate);
    await prizeStore.getPrizeOverviewV2(formattedStartDate, formattedEndDate);
    await chartStore.fetchSeriesData(formattedStartDate, formattedEndDate);
    await chartStore.fetchSeriesWinnerData(formattedStartDate, formattedEndDate);
    

  } catch (error) {
    console.error("Error fetching overview:", error);
  }
};
</script>

<style></style>
