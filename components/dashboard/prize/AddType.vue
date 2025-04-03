<template>
    <div>
        <div class="flex justify-between items-center w-full">
            <Button icon="pi pi-plus" class="mr-4" label="New Prize Type " @click="mainStore.setPrizeModal(true)" />
        </div>

        <Dialog v-model:visible="prizeModal" modal @update:visible="mainStore.setPrizeModal(false)"
            header="New Prize Type" :style="{ width: '40vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
            <template #header>
                <div class="flex flex-col items-start justify-center gap-2 px-2">
                    <span class="font-bold text-xl whitespace-nowrap">New Prize Type</span>
                    <small class="font-light whitespace-nowrap">Create a New Prize Type that would be won in the
                        program</small>
                </div>
            </template>
            <form @submit.prevent="onSubmit" class="w-full lg:px-4 max-sm:px-2 space-y-2">
                <div class="grid grid-cols-2 gap-4">
                    <div class="flex flex-col gap-1">
                        <small class="font-semibold" for="username">Prize Period</small>
                        <Select v-model="formState.period" :options="periods" optionLabel="name" @update:model-value=" prizeStore.getPrizeDistributionTypes()" option-value="id"
                            placeholder="Select a Period" checkmark class="w-full" />

                        <small class="text-red-500" v-if="errors.period">
                            {{ errors.period }}</small>
                    </div>
                    <div class="flex flex-col gap-1">
                        <small class="font-semibold" for="username">Prize Expiry Date </small>
                        <DatePicker v-model="formState.expiry_date" placeholder="01/01/9999" />
                        <small class="text-red-500" v-if="errors.expiry_date">
                            {{ errors.expiry_date }}</small>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="flex flex-col gap-1">
                        <small class="font-semibold" for="username">Prize category</small>
                        <Select v-model="formState.prize_category" :options="categories" optionLabel="name"
                            option-value="id" placeholder="Select a Category" checkmark class="w-full" />

                        <small class="text-red-500" v-if="errors.prize_category">
                            {{ errors.prize_category }}</small>
                    </div>
                    <div class="flex flex-col gap-1">
                        <small class="font-semibold" for="username">Prize Type Name (Optional) </small>
                        <InputText v-model="formState.name" class="w-full" placeholder="eg: Weekly Cash Prize" />
                        <small class="text-red-500" v-if="errors.name">
                            {{ errors.name }}</small>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="flex flex-col gap-1">
                        <small class="font-semibold" for="username">Prize Value in FRW</small>
                        <InputText v-model.number="formState.value" class="w-full" placeholder="eg: 50,000 FRW" />
                        <small class="text-red-500" v-if="errors.value">
                            {{ errors.value }}</small>
                    </div>
                    <div class="flex flex-col gap-1">
                        <small class="font-semibold" for="username">Elligibility (people per period)</small>
                        <InputText v-model.number="formState.elligibility" class="w-full" placeholder="eg: 5 " />
                        <small class="text-red-500" v-if="errors.elligibility">
                            {{ errors.elligibility }}</small>
                    </div>

                </div>
                <div class="grid grid-cols-2 items-center gap-x-4">

                    <div class="flex flex-col gap-1">
                        <small class="font-semibold" for="username">Distribution </small>
                        <Select v-model="formState.distribution" :options="distributions" optionLabel="name"
                            option-value="id" placeholder="Select Type" checkmark class="w-full" />
                        <small class="text-red-500" v-if="errors.distribution">
                            {{ errors.distribution }}</small>
                    </div>
                    <div class="flex flex-col gap-1">
                        <small class="font-semibold" for="username">Trigger Options {{ formState.trigger_by_system }}
                        </small>
                        <div class="flex items-center   gap-x-4">
                            <div v-for="item in triggerBySystemItems" :key="item.name"
                                class="flex items-center border px-3 py-2 w-full rounded-lg">
                                <RadioButton v-model="formState.trigger_by_system" :inputId="item.name" name="dynamic"
                                    :value="item.value" />
                                <label :for="item.name" class="ml-2">{{ item.name }}</label>
                            </div>
                        </div>
                        <small class="text-red-500" v-if="errors.trigger_by_system">
                            {{ errors.trigger_by_system }}</small>
                    </div>

                </div>
                <div class="flex flex-col gap-1">
                    <small class="font-semibold" for="username">Notification (SMS template) </small>

                    <div class="lg:grid grid-cols-2 gap-4">
                        <div v-for="(msg, index) in formState.messages" :key="index">
                            <FloatLabel variant="in">
                                <Textarea id="over_label" class="w-full" :invalid="isOverLimit(index)"
                                    v-model="msg.message" rows="5" cols="30" style="resize: none" />
                                <label for="in_label">{{ msg.lang == 'en' ? 'English' : 'Kinyarwanda' }} SMS
                                    Notification</label>
                            </FloatLabel>
                            <small
                                :class="{ 'text-red-500': isOverLimit(index), 'text-gray-500': !isOverLimit(index) }">
                                {{ msg.message.length }} / {{ maxChars }}
                            </small>

                        </div>
                    </div>



                </div>
                <div class="pt-4 gap-4 flex justify-end">
                    <Button label="Cancel" icon="pi pi-cancel" severity="danger" iconPos="right"
                        @click="mainStore.setPrizeModal(false)" />


                    <Button type="submit" label="Save & Activate" icon="pi pi-save" :loading="loading"
                        :disabled="loading" />
                </div>
            </form>
        </Dialog>

        <Dialog v-model:visible="deleteModal" modal header="Delete" @update:visible="handleDeleteDialogClose"
            :style="{ width: '25vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
            <p class="m-0">
                Are you sure you want to delete this {{ typeData?.name }} record?
            </p>
            <div class="flex justify-end gap-2 mt-4">
                <Button type="button" label="Cancel" severity="danger" text
                    @click="mainStore.setDeleteModal(false)"></Button>
                <Button type="button" label="Delete" severity="danger" icon="pi pi-trash"
                    @click="submitDelete(typeData?.id)"></Button>
            </div>
        </Dialog>

        <Dialog v-model:visible="updateModal" modal @update:visible="mainStore.setUpdateModal(false)"
            header="New Prize Type" :style="{ width: '40vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
            <template #header>
                <div class="flex flex-col items-start justify-center gap-2 px-2">
                    <span class="font-bold text-xl whitespace-nowrap">Update Prize Type</span>
                    <small class="font-light whitespace-nowrap">Create a New Prize Type that would be won in the
                        program</small>
                </div>
            </template>

            <div class="grid grid-cols-2 gap-4">
                <div class="flex flex-col gap-1">
                    <small class="font-semibold">Prize Period</small>
                    <Select v-model="currentType.period" :options="periods" optionLabel="name" option-value="id"
                        placeholder="Select a Period" checkmark class="w-full" />
                </div>
                <div class="flex flex-col gap-1">
                    <small class="font-semibold">Prize Expiry Date</small>
                    <DatePicker v-model="currentType.expiry_date" placeholder="23/10/2026" date-format="dd/mm/yy" />
                </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div class="flex flex-col gap-1">
                    <small class="font-semibold">Prize Category</small>
                    <Select v-model="currentType.prize_category.id" :options="categories" optionLabel="name" option-value="id"
                        placeholder="Select a Category" checkmark class="w-full" />
                </div>
                <div class="flex flex-col gap-1">
                    <small class="font-semibold">Prize Type Name (Optional)</small>
                    <InputText v-model="currentType.name" class="w-full"
                        placeholder="e.g., Weekly Cash Prize" />
                </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div class="flex flex-col gap-1">
                    <small class="font-semibold">Prize Value in FRW</small>
                    <InputText v-model.number="currentType.value" class="w-full" placeholder="e.g., 50,000 FRW" />
                </div>
                <div class="flex flex-col gap-1">
                    <small class="font-semibold">Elligibility (people per period)</small>
                    <InputText v-model.number="currentType.elligibility" class="w-full" placeholder="e.g., 5" />
                </div>
            </div>

            <div class="grid grid-cols-2 items-center gap-x-4">
                <div class="flex flex-col gap-1">
                    <small class="font-semibold">Distribution</small>
                    <Select v-model="currentType.distribution" :options="distributions" optionLabel="name"
                        option-value="id" placeholder="Select Type" checkmark class="w-full" />
                </div>
                <div class="flex flex-col gap-1">
                    <small class="font-semibold">Trigger Options</small>
                    <div class="flex items-center gap-x-4">
                        <div v-for="item in triggerBySystemItems" :key="item.name"
                            class="flex items-center border px-3 py-2 w-full rounded-lg">
                            <RadioButton v-model="currentType.trigger_by_system" :inputId="item.name" name="dynamic"
                                :value="item.value" />
                            <label :for="item.name" class="ml-2">{{ item.name }}</label>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex flex-col gap-1">
                <small class="font-semibold">Notification (SMS template)</small>
                <div class="lg:grid grid-cols-2 gap-4">
                    <div v-for="(msg, index) in currentType.messages || []" :key="index">
                        <FloatLabel variant="in">
                            <Textarea id="over_label" class="w-full" :invalid="isOverLimit(index)" v-model="msg.message"
                                rows="5" cols="30" style="resize: none" />
                            <label>{{ msg.lang === 'en' ? 'English' : 'Kinyarwanda' }} SMS Notification</label>
                        </FloatLabel>
                        <small :class="{ 'text-red-500': isOverLimit(index), 'text-gray-500': !isOverLimit(index) }">
                            {{ msg.message?.length || 0 }} / {{ maxChars }}
                        </small>
                    </div>
                </div>
            </div>

            <div class="pt-4 gap-4 flex justify-end">
                <Button label="Cancel" icon="pi pi-cancel" severity="danger" iconPos="right"
                    @click="mainStore.setUpdateModal(false)" />
                <Button type="submit" label="Save Changes" icon="pi pi-save" @click="updateCurrentPrize(currentType)" :loading="loading" :disabled="loading" />
            </div>
        </Dialog>
    </div>
</template>

<script lang="ts" setup>
import { object, string, number, boolean } from "yup";
const maxChars = 160;
const prizeStore = usePrizeStore();
const mainStore = useMainStore();
const triggerBySystemItems = ref([
    { name: 'Automatic', value: true },
    { name: 'Manual', value: false },
]);
const formState = reactive({
    name: "",
    prize_category: 0,
    value: null,
    elligibility: null,
    period: "",
    expiry_date: null,
    distribution: "",
    trigger_by_system: false,
    messages: [{
        lang: "en",
        message: "",
    }, {
        lang: "rw",
        message: "",
    }],
});
const errors = reactive({
    name: null,
    prize_category: null,
    elligibility: null,
    value: null,
    distribution: null,
    expiry_date: null,
    trigger_by_system: null,
    period: null,
});
const periods = ref([

    { id: "DAILY", name: "Daily" },
    { id: "WEEKLY", name: "Weekly" },
    { id: "MONTHLY", name: "Monthly" },
    { id: "GRAND", name: "Grand" },
])


const prizeSchema = object({
    name: string().required("Title is required"),
    prize_category: string().required("Category is required"),
    period: string().required("Period is required"),
    expiry_date: string().required("Expiry date is required"),
    distribution: string().required("Distribution is required"),
    elligibility: number().typeError('Eligility can be a number').required("Elligibility is required"),
    trigger_by_system: boolean().required("Trigger by system is required"),
    value: number().typeError('Value can be only number').required("Value  is required"),
});

const distributions = computed(() => prizeStore.distributionTYpe);
const prizeModal = computed(() => {
    return mainStore.prizeModal;
});

const updateModal = computed(() => {
    return mainStore.updateModal;
});
const loading = computed(() => {
    return prizeStore.loading;
});

const currentType = computed(() => prizeStore.currentType);

// const isOverLimit = computed(() => formState.messages.message.length > maxChars);
const isOverLimit = (index: number) => formState.messages[index].message.length > maxChars;



const onSubmit = async () => {
    try {
        // Reset errors
        errors.name = null;
        errors.prize_category = null;
        errors.elligibility = null;
        errors.value = null;
        errors.distribution = null;
        errors.expiry_date = null;
        errors.period = null;
        errors.trigger_by_system = null;
        // Validate the form state using Yup
        await prizeSchema.validate(formState, { abortEarly: false });
        // If validation passes, call login action from the auth store
       await prizeStore.AddPrizeType(formState);
       prizeStore.getAllPrizeTypes();
    } catch (validationError) {
        // Handle validation errors
        validationError.inner.forEach((error: any) => {
            errors[error.path] = error.message; // Set the error message for the corresponding field
        });
    }
};


const updateCurrentPrize = (item: any) => {
    prizeStore.AddPrizeType(item);
}
const categories = computed(() => {
    return prizeStore.prizeCategoryies;
});

const typeData = computed(() => {
    return prizeStore.currentType;
});

onMounted(() => {
    prizeStore.getAllPrizeCategories();
    prizeStore.getPrizeDistributionTypes();
});

const deleteModal = computed(() => {
    return mainStore.deleteModal
})

function handleDeleteDialogClose(visible: any) {
    if (!visible) {
        mainStore.setDeleteModal(false);
    }
}

const submitDelete = (recordId: any) => {
    prizeStore.deletePrizeType(recordId);
}

</script>

<style></style>
