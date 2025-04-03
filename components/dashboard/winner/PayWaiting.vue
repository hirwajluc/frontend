<template>
    <div>
        <Dialog v-model:visible="approvalModal" modal header="Payment Approval" @update:visible="handleDialogClose"
            :style="{ width: '25vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
            <form @submit.prevent="sendWaintingTransaction" class="w-full lg:px-4 max-sm:px-2 space-y-2">
                <p class="m-0">
                    Are you sure you want to {{ isFailing ? `resend failed` : `pay waiting` }} transaction?
                </p>
                <div>
                    <div class="rounded-lg py-2">
                        <small class="text-sm text-gray-500 mt-2">System Operator</small>
                        <p class="text-sm font-semibold mt-1 text-primary">{{ operatorEmail }}</p>
                    </div>

                    <div class="flex flex-col gap-1">
                        <label for="password" class="text-sm text-gray-500 "> Password</label>
                        <InputGroup class="my-0">
                            <Password v-model="formState.password" toggleMask :feedback="false" />
                        </InputGroup>
                        <small class="text-red-500" v-if="errors.password"> {{ errors.password }}</small>
                    </div>
                </div>
                <div class="flex justify-end gap-2 mt-4 pt-4">
                    <Button @click="mainStore.setApprovalModal(false)" type="button" label="Cancel" severity="danger"
                        text></Button>
                    <Button type="submit" :label="isFailing ? `Resend Payment` : ` Approve Payment`" severity="success"
                        icon="pi pi-send" iconPos="right"></Button>
                </div>
            </form>
        </Dialog>
    </div>
</template>

<script lang="ts" setup>
import { object, string, number, boolean } from "yup";

const transStore = useTransactionStore();
const userStore = useAuthStore();
const mainStore = useMainStore();
const operatorEmail = computed(() => {
    return userStore.user?.email;
});
const approvalModal = computed(() => {
    return mainStore.approvalModal;
});
const isFailing = computed(() => {
    return transStore.isFailed;
});

function handleDialogClose(visible: any) {
    if (!visible) {
        mainStore.setApprovalModal(false);
    }
}
const waitingIds = computed(() => { return transStore.transactionIds })
const isBulk = computed(() => { return transStore.isBulk })
const formState = reactive({
    password: "",
});


const errors = reactive({
    password: null,
});
const approvalSchema = object({
    password: string().required("System operator password is required"),
});
const sendWaintingTransaction = async () => {
    try {
        // Reset errors
        errors.password = null;

        await approvalSchema.validate(formState, { abortEarly: false });
        // If validation passes, call login action from the auth store
        if (isBulk.value) {
            formState.transaction_ids = waitingIds.value;
        } else {
            delete formState.transaction_ids; // Remove it if not needed
        }
        isBulk.value ?
            isFailing.value ? transStore.resendBulkTransactions(formState) :
                transStore.confirmBulkTransactions(formState) : isFailing.value ? transStore.resendSingleTransactions(waitingIds.value, formState) :transStore.confirmSingleTransactions(waitingIds.value, formState)
        Object.assign(formState, {
            password: "",
        });

    } catch (validationError) {
        // Handle validation errors
        validationError.inner.forEach((error: any) => {
            errors[error.path] = error.message; // Set the error message for the corresponding field
        });
    }
}

</script>

<style></style>
