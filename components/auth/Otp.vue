<template>
    <div class="px-20 max-sm:px-6 max-sm:py-8 col-span-1 space-y-6 flex flex-col items-center justify-start py-24">
        <AuthHeading title="Lottery System Login" subtitle="Welcome to the official administration of the BRALIRWA Lottery
        campaign. Please login with the username and password provided to you by
        your IT administrator." />
        <form @submit.prevent="verifyOTP" class="w-full flex flex-col items-center space-y-5 max-sm:py-6 py-12 lg:px-20   px-1">
            <InputOtp integerOnly v-model="state.otp" :length="6" style="gap: 0">
                <template #default="{ attrs, events, index }">
                    <input type="text" v-bind="attrs" v-on="events" class="custom-otp-input" />

                </template>
            </InputOtp>
            <div class="flex flex-col space-y-6   mx-auto w-full justify-start items-center">
                <Button label="Send Password reset" type="submit" icon="pi pi-arrow-right" iconPos="right"
                    :loading="loading" :disabled="loading" size="large" class="w-full mt-6" />
                <Button as="router-link" label="Back to login" to="/auth/login" link />
            </div>


        </form>
        <div class="font-semibold text-gray-400 text-center cursor-pointer hover:text-primary duration-300">
            Don’t have an account? Contact your Admin
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { Login } from "~/types";
import { object, string, number, date, type InferType, boolean } from "yup";

const authStore = useAuthStore();
const value = ref("");

const route = useRoute();
const schema = object({
    otp: string().optional(),
    reset_key: string().optional(),
});
type Schema = InferType<typeof schema>;
interface OTPState {
    otp: string ;
    reset_key: string | null | undefined;
}
const resetKey = computed(() => {
    return route.query.reset_key as string;
});
const state = reactive<OTPState>({
    otp: "",
    reset_key: resetKey.value,
});
// Error state
const errors = reactive({
    otp: null,
    reset_key: null,
})
const loading = computed(() => {
    return authStore.loading;
});

const alertStore = useAlertStore();
const resendCode = async (param: any) => {
    var requestData = {
        email: param,
    };
    if (param != null) {
        if (route.query.type == "reset") {
            await authStore.requestResetPassword(requestData);
        }
    } else {
        alertStore.error("Invalid email address");
        navigateTo('/auth/forgot-password');
    }
};


const verifyOTP = async () => {
    try {
        // Reset errors
        errors.otp = null;
        errors.reset_key = null;

        // Validate the form state using Yup
        await schema.validate(state, { abortEarly: false });

        route.query.type != "reset" || state.otp.length < 6
            ? alertStore.error("Invalid Reset Key or OTP code " + state.otp.length)
            : authStore.validateOtp(state);

    } catch (validationError) {
        // Handle validation errors
        validationError.inner.forEach((error: any) => {
            errors[error.path] = error.message; // Set the error message for the corresponding field
        });
    }
};



</script>
<!-- 324323 -->
<style>
.custom-otp-input {
    width: 68px;
    height: 68px;
    font-size: 32px;
    appearance: none;
    text-align: center;
    transition: all 0.2s;
    font-weight: 900;
    border: 1px solid var(--p-inputtext-border-color);
    background: transparent;
    outline-offset: -2px;
    outline-color: transparent;
    transition: outline-color 0.3s;
    border-radius: 12px;
    margin: 8px;
    color: var(--p-inputtext-color);
    border-style: solid;
    border-color: var(--p-inputtext-border-color);
    border-width: 1px;
}

/* Media query for small screens (e.g., mobile devices) */
@media screen and (max-width: 600px) {
    .custom-otp-input {
        width: 48px;
        height: 48px;
        font-size: 24px;
    }
}

/* Media query for medium screens (e.g., tablets) */
@media screen and (min-width: 601px) and (max-width: 1024px) {
    .custom-otp-input {
        width: 58px;
        height: 58px;
        font-size: 28px;
    }
}

/* Media query for large screens (e.g., desktops) */
@media screen and (min-width: 1025px) {
    .custom-otp-input {
        width: 68px;
        height: 68px;
        font-size: 32px;
    }
}

.custom-otp-input:focus {
    outline: 1px solid var(--p-focus-ring-color);
}
</style>
