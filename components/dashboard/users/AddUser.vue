<template>
    <div>
        <Button v-if="authStore.user.can_add_user" type="button" icon="pi pi-user-plus" label="Add New User"
            @click="mainStore.setAddUserModal(true)" />
        <Dialog v-model:visible="addModal" modal header="New User" @update:visible="handleAddDialogClose"
            :style="{ width: '30vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
            <template #header>
                <div class="flex flex-col items-start justify-center gap-2 px-2">
                    <span class="font-bold text-xl whitespace-nowrap">New User</span>
                    <small class="font-light whitespace-nowrap">Create a New Prize that would be won in the
                        program</small>
                </div>
            </template>
            <form @submit.prevent="onSubmit" class="w-full lg:px-4 max-sm:px-2 space-y-2">
                <div class="lg:grid grid-cols-2 gap-3">
                    <div class="flex flex-col gap-1">
                        <small for="username">First Name </small>
                        <InputText v-model="formState.fname" class="w-full" />
                        <small class="text-red-500" v-if="errors.fname">
                            {{ errors.fname }}</small>
                    </div>
                    <div class="flex flex-col gap-1">
                        <small for="username">Last Name </small>
                        <InputText v-model="formState.lname" class="w-full" />
                        <small class="text-red-500" v-if="errors.lname">
                            {{ errors.lname }}</small>
                    </div>
                </div>

                <div class="lg:grid grid-cols-2 gap-3">
                    <div class="flex flex-col gap-1">
                        <small for="username">Phone number</small>
                        <InputText v-model="formState.phone" class="w-full" he />
                        <small class="text-red-500" v-if="errors.phone">
                            {{ errors.phone }}</small>
                    </div>
                    <div class="flex flex-col gap-1">
                        <small for="username">Email address</small>
                        <InputText v-model="formState.email" class="w-full" />
                        <small class="text-red-500" v-if="errors.email">
                            {{ errors.email }}</small>
                    </div>
                </div>
                <small class="text-sm text-gray-400">User will received default password on this phone number. make sure
                    it is correct</small>
                <div class="flex flex-col gap-1">
                    <small for="username">Department</small>
                    <Select v-model="formState.department" :options="departments" optionLabel="title" optionValue="id"
                        placeholder="Select a department" class="w-full  " />

                    <small class="text-red-500" v-if="errors.department">
                        {{ errors.department }}</small>
                </div>
                <div class="flex flex-col gap-1">
                    <small for="username">Access Level</small>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="flex items-center gap-2 border border-border rounded-md p-2">
                            <Checkbox v-model="formState.can_add_codes" binary variant="filled" />
                            <label class="text-xs uppercase font-semi-bold"
                                :class="formState.can_add_codes ? `text-primary font-bold` : ``">Can Add
                                Code</label>
                        </div>
                        <div class="flex items-center gap-2 border border-border rounded-md p-2">
                            <Checkbox v-model="formState.can_trigger_draw" binary variant="filled" />
                            <label class="text-xs uppercase font-semi-bold"
                                :class="formState.can_trigger_draw ? `text-primary font-bold` : ``">Can Trigger
                                Draw</label>
                        </div>
                        <div class="flex items-center gap-2 border border-border rounded-md p-2">
                            <Checkbox v-model="formState.can_add_user" binary variant="filled" />
                            <label class="text-xs uppercase font-semi-bold"
                                :class="formState.can_add_user ? `text-primary font-bold` : ``">Can Add User</label>
                        </div>
                        <div class="flex items-center gap-2 border border-border rounded-md p-2">
                            <Checkbox v-model="formState.can_view_logs" binary variant="filled" />
                            <label class="text-xs uppercase font-semi-bold"
                                :class="formState.can_view_logs ? `text-primary font-bold` : ``">Can View
                                Logs</label>
                        </div>
                    </div>

                </div>

                <div class="pt-4 gap-4 flex justify-end">
                    <Button label="Cancel" icon="pi pi-cancel" severity="danger" iconPos="right"
                        @click="mainStore.setAddUserModal(false)" />


                    <Button type="submit" label="Save User" icon="pi pi-save" :loading="loading" :disabled="loading" />
                </div>
            </form>
        </Dialog>

        <Dialog v-model:visible="deleteModal" modal :header="`${user?.status == 'OKAY' ? 'Ban' : 'Enable'} User`"
            @update:visible="handleDeleteDialogClose" :style="{ width: '25vw' }"
            :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
            <p class="m-0 font-medium">
                Are you sure you want to {{ user?.status == 'OKAY' ? `ban` : `enable` }} this user <strong>{{
                    user?.firstname + " " + user?.lastname }} ?</strong>
            </p>
            <div class="flex justify-end gap-2 mt-4">
                <Button type="button" label="Cancel" severity="danger" icon="pi pi-times" text
                    @click="mainStore.setDeleteModal(false)"></Button>
                <Button type="button" :icon="`${user?.status == 'OKAY' ? 'pi pi-ban' : 'pi pi-check'}`"
                    :severity="`${user?.status == 'OKAY' ? 'danger' : 'primary'}`"
                    :label="`${user?.status == 'OKAY' ? 'Ban' : 'Enable'}`" :loading="loading" :disabled="loading"
                    @click="userStore.changeUserStatus(user, user?.status == 'OKAY' ? 'DISABLED' : 'OKAY')"></Button>
            </div>
        </Dialog>

        <Dialog v-model:visible="updateModal" modal header="New User" @update:visible="handleUpdateDialogClose"
            :style="{ width: '30vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
            <template #header>
                <div class="flex flex-col items-start justify-center gap-2 px-2">
                    <span class="font-bold text-xl whitespace-nowrap">Update User</span>
                    <small class="font-light whitespace-nowrap">Create a Update Prize that would be won in the
                        program</small>
                </div>
            </template>
            <form  class="w-full lg:px-4 max-sm:px-2 space-y-2">
                <div class="lg:grid grid-cols-2 gap-3">
                    <div class="flex flex-col gap-1">
                        <small for="username">First Name </small>
                        <InputText v-model="formState.fname" class="w-full" />
                        <small class="text-red-500" v-if="errors.fname">
                            {{ errors.fname }}</small>
                    </div>
                    <div class="flex flex-col gap-1">
                        <small for="username">Last Name </small>
                        <InputText v-model="formState.lname" class="w-full" />
                        <small class="text-red-500" v-if="errors.lname">
                            {{ errors.lname }}</small>
                    </div>
                </div>

                <div class="lg:grid grid-cols-2 gap-3">
                    <div class="flex flex-col gap-1">
                        <small for="username">Phone number</small>
                        <InputText v-model="formState.phone" class="w-full" he />
                        <small class="text-red-500" v-if="errors.phone">
                            {{ errors.phone }}</small>
                    </div>
                    <div class="flex flex-col gap-1">
                        <small for="username">Email address</small>
                        <InputText v-model="formState.email" class="w-full" />
                        <small class="text-red-500" v-if="errors.email">
                            {{ errors.email }}</small>
                    </div>
                </div>
                <small class="text-sm text-gray-400">User will received default password on this phone number. make sure
                    it is correct</small>
                <div class="flex flex-col gap-1">
                    <small for="username">Department</small>
                    <Select v-model="formState.department" :options="departments" optionLabel="title" optionValue="id"
                        placeholder="Select a department" class="w-full  " />

                    <small class="text-red-500" v-if="errors.department">
                        {{ errors.department }}</small>
                </div>
             
                 <div class="flex flex-col gap-1">
                    <small for="username">Access Level</small>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="flex items-center gap-2 border border-border rounded-md p-2">
                            <Checkbox v-model="formState.can_add_codes" binary variant="filled" />
                            <label class="text-xs uppercase font-semi-bold"
                                :class="formState.can_add_codes ? `text-primary font-bold` : ``">Can Add
                                Code</label>
                        </div>
                        <div class="flex items-center gap-2 border border-border rounded-md p-2">
                            <Checkbox v-model="formState.can_trigger_draw" binary variant="filled" />
                            <label class="text-xs uppercase font-semi-bold"
                                :class="formState.can_trigger_draw ? `text-primary font-bold` : ``">Can Trigger
                                Draw</label>
                        </div>
                        <div class="flex items-center gap-2 border border-border rounded-md p-2">
                            <Checkbox v-model="formState.can_add_user" binary variant="filled" />
                            <label class="text-xs uppercase font-semi-bold"
                                :class="formState.can_add_user ? `text-primary font-bold` : ``">Can Add User</label>
                        </div>
                        <div class="flex items-center gap-2 border border-border rounded-md p-2">
                            <Checkbox v-model="formState.can_view_logs" binary variant="filled" />
                            <label class="text-xs uppercase font-semi-bold"
                                :class="formState.can_view_logs ? `text-primary font-bold` : ``">Can View
                                Logs</label>
                        </div>
                    </div>

                </div>

                <div class="pt-4 gap-4 flex justify-end">
                    <Button label="Cancel" icon="pi pi-cancel" severity="danger" iconPos="right"
                        @click="mainStore.setUpdateModal(false)" />

                    <Button @click="updateForm()" label="Save Changes" icon="pi pi-save" :loading="loading" :disabled="loading" />
                </div>
            </form>
        </Dialog>

    </div>
</template>

<script lang="ts" setup>
import { object, string, number, date, type InferType, boolean } from "yup";
import type { AccountData } from "~/types";
const authStore = useAuthStore()
const mainStore = useMainStore()
const formState = reactive({
    id:"",
    fname: "",
    lname: "",
    email: "",
    phone: "",
    department: "",
    can_add_codes: false,
    can_trigger_draw: false,
    can_view_logs: false,
    can_add_user: false,
});

const errors = reactive({
    fname: null,
    lname: null,
    phone: null,
    department: null,
    email: null,
});

const prizeSchema = object({
    fname: string().required("First name is required"),
    lname: string().required("Last name is required"),
    department: string().required("department is required"),
    phone: string()
        .matches(/^2507[2389]\d{7}$/, 'Invalid phone number')
        .required('Phone number is required'),
    email: string().email('Invalid email  address').required("Value  is required"),
});
const store = useUserStore()
const addModal = computed(() => {
    return mainStore.addUserModal
})

const updateModal = computed(() => {
    return mainStore.updateModal
})
const deleteModal = computed(() => {
    return mainStore.deleteModal
})
const userStore = useUserStore();

const departments = computed(() => {
    return userStore.departments || [];
})

function handleAddDialogClose(visible: any) {
    if (!visible) {
        mainStore.setAddUserModal(false);
    }
}

function handleUpdateDialogClose(visible: any) {
    if (!visible) {
        mainStore.setUpdateModal(false);
    }
}

const user = computed(() => { return userStore.user; });

const onSubmit = async () => {
    try {
        // Reset errors
        errors.lname = null;
        errors.fname = null;
        errors.department = null;
        errors.email = null;
        errors.phone = null;

        // Validate the form state using Yup
        await prizeSchema.validate(formState, { abortEarly: false });

        // If validation passes, call login action from the auth store
        await store.addUser(formState);
    } catch (validationError) {
        // Handle validation errors
        validationError.inner.forEach((error: any) => {
            errors[error.path] = error.message; // Set the error message for the corresponding field
        });
    }
};


function handleDeleteDialogClose(visible: any) {
    if (!visible) {
        mainStore.setDeleteModal(false);
    }
}

const loading = computed(() => {
    return store.loading;
}); // Loading state for upload process

onMounted(() => {
    // Fetch the departments on mount
    userStore.getAllDepartment();
})

const computedFormState = computed(() => {
    if (updateModal.value) {
        return {
            id: user.value?.id,
            fname: user.value?.firstname,
            lname: user.value?.lastname,
            email: user.value?.email,
            phone: user.value?.phone,
            department: user.value?.department, // keep existing department if needed
            can_add_codes: user.value?.can_add_codes,
            can_trigger_draw: user.value?.can_trigger_draw,
            can_view_logs: user.value?.can_view_logs,
            can_add_user: user.value?.can_add_user,
        };
    }
    return formState;
});

// Sync computedFormState with formState
watchEffect(() => {
    Object.assign(formState, computedFormState.value);
});
const updateForm = async () => {
    await store.updateUser(formState);
}


</script>
<style scoped></style>