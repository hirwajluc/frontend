<template>
  <div>
    <div class="flex justify-between items-center w-full">
    
      <Button icon="pi pi-plus" class="mr-4" label="New Prize Type " @click="mainStore.setPrizeModal(true)" />
    </div>

    <Dialog v-model:visible="prizeModal" modal @update:visible="mainStore.setPrizeModal(false)" header="New Prize Type"
      :style="{ width: '30vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
      <template #header>
        <div class="flex flex-col items-start justify-center gap-2 px-2">
          <span class="font-bold text-xl whitespace-nowrap">New Prize</span>
          <small class="font-light whitespace-nowrap">Create a New Prize that would be won in the program</small>
        </div>
      </template>
      <form @submit.prevent="onSubmit" class="w-full lg:px-4 max-sm:px-2 space-y-2">
        <div class="flex flex-col gap-1">
          <small for="username">Prize category</small>
          <Select v-model="formState.category" :options="categories" optionLabel="name" option-value="id"
            placeholder="Select a Category" checkmark class="w-full" />

          <small class="text-red-500" v-if="errors.category">
            {{ errors.category }}</small>
        </div>
        <div class="flex flex-col gap-1">
          <small for="username">Prize Name (optional)</small>
          <InputText v-model="formState.title" class="w-full" />
          <small class="text-red-500" v-if="errors.title">
            {{ errors.title }}</small>
        </div>
        <div class="flex flex-col gap-1">
          <small for="username">Prize Value in RWF</small>
          <InputText v-model="formState.valueInRwf" class="w-full" />
          <small class="text-red-500" v-if="errors.valueInRwf">
            {{ errors.valueInRwf }}</small>
        </div>
        <div class="flex flex-col gap-1">
          <small for="username">Elligibility (Available Prizes)</small>
          <InputText v-model="formState.elligibility" class="w-full" />
          <small class="text-red-500" v-if="errors.elligibility">
            {{ errors.elligibility }}</small>
        </div>
        <div class="flex flex-col gap-1">
          <small for="username">Distribution</small>
          <InputText v-model="formState.distribution" class="w-full" />
          <small class="text-red-500" v-if="errors.distribution">
            {{ errors.distribution }}</small>
        </div>
        <div class="pt-4 gap-4 flex justify-end">
          <Button   label="Cancel" icon="pi pi-cancel" severity="danger" iconPos="right" @click="mainStore.setPrizeModal(false)" />

          <Button outlined label="Save as Draft" icon="pi pi-cancel" iconPos="right" />

          <Button type="submit" label="Save & Activate" :loading="loading" :disabled="loading" />
        </div>
      </form>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import { object, string, number, date, type InferType, boolean } from "yup";

const prizeStore = usePrizeStore();
const mainStore = useMainStore();
const formState = reactive({
  title: "",
  category: "",
  valueInRwf: "",
  elligibility: "",
  distribution: "",
  notify: false,
});
const errors = reactive({
  title: null,
  category: null,
  elligibility: null,
  valueInRwf: null,
  distribution: null,
});

const prizeSchema = object({
  title: string().required("Title is required"),
  category: string().required("Category is required"),
  elligibility: string().required("Elligibility is required"),
  valueInRwf: string().required("Value  is required"),
  notify: boolean(),
});

const prizeModal = computed(() => {
  return mainStore.prizeModal;
});
const loading = computed(() => {
  return prizeStore.loading;
});

const onSubmit = async () => {
  try {
    // Reset errors
    errors.title = null;
    errors.category = null;
    errors.elligibility = null;
    errors.valueInRwf = null;
    errors.distribution = null;

    // Validate the form state using Yup
    await prizeSchema.validate(formState, { abortEarly: false });

    // If validation passes, call login action from the auth store
    await prizeStore.AddPrizeCategorory(formState);
  } catch (validationError) {
    // Handle validation errors
    validationError.inner.forEach((error: any) => {
      errors[error.path] = error.message; // Set the error message for the corresponding field
    });
  }
};

const categories = computed(() => {
  return prizeStore.prizeCategoryies;
});

onMounted(() => {
  // Fetch categories from the store
  prizeStore.getAllPrizeCategories();
});

const value = ref("Histories");
const options = ref(["Histories", "Prizes"]);
</script>

<style></style>
