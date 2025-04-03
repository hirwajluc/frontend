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
                <DataTable v-model:selection="selectedEntry" :value="filteredUsers" dataKey="id"
                    tableStyle="min-width: 50rem" stripedRows paginator :rows="10" :loading="loading"
                    :globalFilter="globalFilter" :globalFilterFields="['user', 'email', 'department', 'status']">
                    <template #header>
                        <div class="flex justify-between">
                            <IconField>
                                <InputIcon>
                                    <i class="pi pi-search" />
                                </InputIcon>
                                <InputText v-model="globalFilter" placeholder="Keyword Search" />
                            </IconField>
                            <DashboardUsersAddUser />

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
                    <Column field="user" header="USER">
                        <template #body="{ data }">
                            <div class="flex flex-col">
                                <span class="text-surface-700 dark:text-surface-0"> {{
                                    data.firstname + " " + data.lastname
                                    }}</span>

                            </div>
                        </template>
                    </Column>

                    <Column field="email" header="EMAIL">
                        <template #body="{ data }">
                            <div class="flex flex-col">
                                <span class="text-surface-700 dark:text-surface-0">{{
                                    data.email
                                    }}</span>
                            </div>
                        </template>
                    </Column>
                    <Column field="phone" header="PHONE">
                        <template #body="{ data }">
                            <div class="flex flex-col">
                                <span class="text-surface-700 dark:text-surface-0">{{
                                    data.phone
                                    }}</span>
                            </div>
                        </template>
                    </Column>
                    <Column field="can_add_codes" header="ACCESS LEVEL">
                        <template #body="{ data }">
                            <div class="grid grid-cols-2 gap-2">
                                <small class="border rounded-sm border-border p-1 font-semibold text-[10px] "
                                    v-if="data.can_add_user">
                                    CAN ADD USER
                                </small>
                                <small class="border rounded-sm border-border p-1 font-semibold text-[10px] "
                                    v-if="data.can_add_codes">
                                    CAN ADD CODES
                                </small>
                                <small class="border rounded-sm border-border p-1 font-semibold text-[10px] "
                                    v-if="data.can_view_logs">
                                    CAN VIEW LOGS
                                </small>
                                <small class="border rounded-sm border-border p-1 font-semibold text-[10px] "
                                    v-if="data.can_trigger_draw">
                                    CAN TRIGGER DRAW
                                </small>
                            </div>


                        </template>
                    </Column>
                    <Column field="status" header="Status">
                        <template #body="{ data }">
                            <div class="font-bold flex   py-1.5 text-sm  ">
                                {{ data.status }}
                            </div>
                        </template>
                    </Column>

                    <Column header="ACTION" class="w-24 !text-end">
                        <template #body="{ data }">

                            <div class="flex items-center gap-x-4">
                                <Button :icon="`${data?.status == 'OKAY' ? 'pi pi-ban' : 'pi pi-check'}`"
                                    :severity="`${data?.status == 'OKAY' ? 'danger' : 'primary'}`"
                                    :label="`${data?.status == 'OKAY' ? 'Ban' : 'Enable'}`" text @click="banUser(data)"
                                    :disabled="userID == data.id" size="small" />

                                <Button icon="pi pi-pencil" size="small" label="Edit" text @click="editUser(data)" />



                            </div>


                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
definePageMeta({
    title: "Users",
    layout: "dashboard",
    middleware: "auth",
});
const mainStore = useMainStore();
const home = ref({
    icon: "pi pi-cog",
    label: "Settings",
    route: "/dashboard",
});
const items = ref([{ label: "Users" }]);
const globalFilter = ref(''); // Reactive property for search input
const userStore = useUserStore();
const users = computed(() => {
    return userStore.users.slice().sort((a: any, b: any) => b.id - a.id);
});
const authStore = useAuthStore();
const selectedEntry = ref<any>([]);
const userID = computed(() => {
    return authStore.user.id;
});

const loading = computed(() => {
    return userStore.loading;
});

onMounted(() => {
    userStore.getAllUsers();
});
// Method to handle search input// Computed property for filtered codes based on the search input
const filteredUsers = computed(() => {
    if (!globalFilter.value) {
        return users.value; // Return all codes if no filter is applied
    }
    const filter = globalFilter.value.toLowerCase();
    return users.value.filter((code: any) => {
        return (
            code.id.toLowerCase().includes(filter) ||
            code.status.toLowerCase().includes(filter) ||
            code.phone.toLowerCase().includes(filter) ||
            code.email.toLowerCase().includes(filter) ||
            code.firstname.toLowerCase().includes(filter) ||
            code.lastname.toLowerCase().includes(filter)
        );
    });
});
const router = useRouter();
const viewUserProfile = (user: any) => {
    userStore.setUser(user);
    router.push("/dashboard/users/profile");
};
const banUser = (user: any) => {

    mainStore.setDeleteModal(true)
    userStore.setUser(user)
}

const editUser = (user: any) => {
    userStore.setUser(user);
    mainStore.setUpdateModal(true)

};
</script>

<style></style>
