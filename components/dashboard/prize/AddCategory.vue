<template>
    <div>
        <div class="flex justify-between items-center w-full">

            <Button icon="pi pi-plus" class="mr-4" label="New Prize Category "
                @click=" mainStore.setPrizeModal(true)" />
        </div>

        <Dialog v-model:visible="prizeModal" modal @update:visible="handleDialogClose" header="New Prize Type"
            :style="{ width: '30vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
            <template #header>
                <div class="flex flex-col items-start justify-center gap-2 px-2">
                    <span class="font-bold text-xl whitespace-nowrap">New Prize Category</span>
                    <small class="font-light whitespace-nowrap">Create a New Prize Category that would be won in the
                        program</small>
                </div>
            </template>
            <form @submit.prevent="onSubmit" class="w-full lg:px-4 max-sm:px-2 space-y-2">

                <div class="flex flex-col gap-1">
                    <small for="username">Category name</small>
                    <InputText v-model="formState.name" placeholder="Enter name" class="w-full" />
                    <small class="text-red-500" v-if="errors.name">
                        {{ errors.name }}</small>
                </div>



                <div class="pt-4 gap-4 flex justify-end">
                    <Button label="Cancel" icon="pi pi-cancel" severity="danger" iconPos="right"
                        @click="mainStore.setPrizeModal(false)" />

                    <Button type="submit" label="Save category" :loading="loading" :disabled="loading" />
                </div>
            </form>
        </Dialog>

        <Dialog v-model:visible="deleteModal" modal header="Delete" @update:visible="handleDeleteDialogClose"
            :style="{ width: '25vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
            <p class="m-0">
                Are you sure you want to delete this {{ categoryData?.name }} record?
            </p>
            <div class="flex justify-end gap-2 mt-4">
                <Button type="button" label="Cancel" severity="danger" text
                    @click="mainStore.setDeleteModal(false)"></Button>
                <Button type="button" label="Delete" severity="danger" icon="pi pi-trash"
                    @click="submitDelete(categoryData?.id)"></Button>
            </div>
        </Dialog>
    </div>
</template>

<script lang="ts" setup>
import { object, string, number, date, type InferType, boolean } from "yup";

const prizeStore = usePrizeStore();
const mainStore = useMainStore();
const formState = reactive({
    name: "",
});
const errors = reactive({
    name: null,

});

const prizeSchema = object({
    name: string().required("Category name is required"),

});

const prizeModal = computed(() => {
    return mainStore.prizeModal;
});

const categoryData = computed(() => {
    return prizeStore.currentCategory;
});
const loading = computed(() => {
    return prizeStore.loading;
});

const onSubmit = async () => {
    try {
        // Reset errors
        errors.name = null;


        // Validate the form state using Yup
        await prizeSchema.validate(formState, { abortEarly: false });

        // If validation passes, call login action from the auth store
        await prizeStore.AddPrizeCategorory(formState);
        formState.name = "";
    } catch (validationError) {
        // Handle validation errors
        validationError.inner.forEach((error: any) => {
            errors[error.path] = error.message; // Set the error message for the corresponding field
        });
    }
};
const deleteModal = computed(() => {
    return mainStore.deleteModal
})

function handleDialogClose(visible: any) {
    if (!visible) {
        mainStore.setPrizeModal(false);
    }
}

function handleDeleteDialogClose(visible: any) {
    if (!visible) {
        mainStore.setDeleteModal(false);
    }
}

const submitDelete = (recordId: any) => {
    prizeStore.deletePrizeCategory(recordId);
}


</script>

<style></style>
