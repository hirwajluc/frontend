<template>
  <div class="flex-col space-y-4">
    <div
      class="border border-border bg-card rounded-lg p-5 lg:flex max-sm:space-y-3 items-center justify-between gap-6"
    >
      <div class="flex items-center gap-x-8">
        <Avatar
          image="https://avatar.iran.liara.run/public"
          class="mr-2"
          size="large"
          shape="circle"
        />

        <div class="lg:grid max-sm:space-y-2 grid-cols-12 gap-10">
          <div class="flex flex-col col-span-3">
            <small class="text-gray-400 text-xs uppercase">Full names</small>
            <div class="font-medium text-gray-800 lg:text-xl">{{ customer?.customer }}</div>
          </div>
          <div class="flex flex-col col-span-3">
            <small class="text-gray-400 text-xs uppercase">Phone</small>
            <div class="font-medium text-gray-800 lg:text-xl">{{customer?.phone}}</div>
          </div>
          <div class="flex flex-col col-span-3">
            <small class="text-gray-400 text-xs uppercase">Location</small>
            <div class="font-medium text-gray-800 lg:text-xl">
              {{ customer?.province + ' - '+ customer?.district }}
            </div>
          </div>
        </div>
      </div>

      <div class="gap-4 flex">
        <Button icon="pi pi-send" severity="secondary" aria-label="Send" @click="sendSMS" />
        <Button icon="pi pi-phone" severity="secondary" aria-label="Phone" />
        <Button
          icon="pi pi-whatsapp"
          severity="secondary"
          aria-label="WhatsApp"
           @click="sendWhatsapp"
        />
      </div>
    </div>
    <div
      class="  border-border rounded-lg py-5 lg:flex flex-col max-sm:space-y-3 items-start justify-start gap-6"
    >
      <div class="font-semibold text-gray-700 uppercase">User Lottery Code</div>

      <div class="grid grid-cols-4 w-full gap-6">
        <div
          v-for="(item, i) in entryCodeItems"
          class="  w-full  shadow-xs    rounded-lg border col-span-1 p-2"
        >

        
        <div class="flex w-full gap-x-2 items-center">
<div class="relative h-24 w-24 rounded">
          <img src="/assets/images/cap-2.png" class="absolute top-0 left-0 w-full h-full "></img>
          <div class="absolute top-0 left-0 w-full h-full rounded items-center justify-center font-bold flex text-primary text-lg"> {{ useFormatNumbers(item.amount) }}</div>
          
        </div>

        <div class="border-t border-b text-3xl px-3 uppercase flex border-dashed font-semibol border-primary/20 py-3 ">
          GL{{item.entry_code}}
        </div>

        </div>

        <div class="flex items-center mx-2 justify-between">
          <div class="flex-col flex text-xs font-light   py-1 ">
            <small>Entry Date</small>
           {{item.entry_at}}
          </div>
        
          <Badge :value="statusStr(item.status)" :severity="statusClr(item.status)"></Badge>

        </div>
         
        </div>
      </div>
              <Paginator :rows="10" :totalRecords="entryCodeItems.length"  ></Paginator>

    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  title: "Manage Entries Details",
  layout: "dashboard",
  middleware: "auth",
});

const route = useRoute()
const alert = useAlertStore()
const customerId = ref(route.params.id)
const store = useEntriesStore();

const entryCodeItems = computed(() => {
  return store.customerEntries;
})

const customer = computed(() => {
  return store.customer;
})
onMounted(() => {
  // Fetch customer data here
  store.getAllCustomerEnrties(customerId.value)
  store.getCustomerInfo(customerId.value)
})
const sendWhatsapp = () => {
  alert.success("Message sent successfully") 
}

const sendSMS = () => {
  alert.success("SMS sent successfully") 
}
const statusStr = (status : any) => {
  if(status == "1") {
    return 'Won'
  } else {
    return 'Pending'
  }
}

const statusClr = (status : any) => {
  if(status == "1") {
    return 'success'
  } else {
    return 'warn'
  }
}
</script>

<style></style>
