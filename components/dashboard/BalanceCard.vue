<template>
    <div class="  lg:grid grid-cols-4 items-center gap-x-4 max-sm:space-y-2">
        <div class="flex items-center space-y-2 p-5 rounded-lg bg-border gap-4">
            <div>
                <i class="pi pi-wallet p-5 rounded-lg bg-green-700/20 text-primary text-2xl"></i>
            </div>
            <div class="flex flex-col   ">
                <div class="flex items-end space-x-4">
                    <div class="text-3xl font-semibold text-primary ">
                        {{ '1,200,000,000' }}
                    </div>
                    <div class="text-sm pb-1 text-gray-400">Rwf</div>
                </div>
                <div class="flex items-center space-x-2">
                    <h2 class="text-sm  text-gray-600 font-semibold">{{ 'Total Balance' }}</h2>
                </div>

            </div>
        </div>
        <div class="flex items-center space-y-2 p-5 rounded-lg bg-border gap-4">
            <div>
                <img src="./../../assets/images/mtn.png" class="h-16 w-16 rounded-lg" alt="">
            </div>
            <div class="flex flex-col   ">
                <div class="flex items-end space-x-4">
                    <div class="text-3xl font-semibold text-primary ">
                        {{ '1,200,000' }}
                    </div>
                    <div class="text-sm pb-1 text-gray-400">Rwf</div>
                </div>
                <div class="flex items-center space-x-2">
                    <h2 class="text-sm  text-gray-600 font-semibold">{{ 'Distributed Amount' }}</h2>
                </div>
            </div>
        </div>
        <div class="flex items-center space-y-2 p-5 rounded-lg bg-border gap-4">
            <div>
                <img src="./../../assets/images/airtel.jpg" class="h-16 w-16 rounded-lg" alt="">
            </div>
            <div class="flex flex-col   ">
                <div class="flex items-end space-x-4">
                    <div class="text-3xl font-semibold text-primary ">
                        {{ '1,200,000' }}
                    </div>
                    <div class="text-sm pb-1 text-gray-400">Rwf</div>
                </div>
                <div class="flex items-center space-x-2">
                    <h2 class="text-sm  text-gray-600 font-semibold">{{ 'Distributed Amount' }}</h2>
                </div>
            </div>
        </div>
        <div class="flex flex-col gap-2 border p-2 rounded-lg border-border">
            <div class="font-semibold text-green-700">Top UP Balance</div>
            <div class="font-light text-xs text-gray-500">You can top up your balance from here</div>
            <div class="flex gap-4">
                <Button type="button" icon="pi pi-file-arrow-up" label="Top up" @click="showTopup = true" />
            </div>
        </div>
        <Dialog v-model:visible="showTopup" modal header="Upload Codes" @update:visible="handleUploadDialogClose"
            :style="{ width: '30vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
            <div class="m-0">
                <p class="m-0 mb-4 text-sm font-thin">
                    Enter Your phone number and amount you want to deposit
                </p>
                <div class="mt-4">
                    <div class="flex flex-col gap-y-1">
                        <label for="location" class="font-thin">Phone number</label>
                        <InputText v-model="state.phone" filled />
                    </div>
                    <div class="flex flex-col gap-y-1 mt-2">
                        <label for="location" class="font-thin">Amount</label>
                        <InputText v-model="state.amount" filled />
                    </div>
                </div>
            </div>
            <div class="flex justify-end gap-2 mt-4">
                <Button type="button" label="Cancel" severity="danger" @click="showTopup = false"></Button>
                <Button type="button" label="Save Code" icon="pi pi-save" @click="showTopup = false"></Button>
            </div>
        </Dialog>
    </div>

</template>

<script lang="ts" setup>
const props = defineProps<{
    title: string;
    amount: string;
    icon: string
}>();

const showTopup = ref(false)

const state = reactive({
    phone: undefined,
    amount: undefined
})
</script>

<style></style>
