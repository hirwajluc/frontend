<template>
    <div class="flex flex-col space-y-2 p-5 rounded-lg bg-border  ">
        <div class="flex items-center space-x-2">
            <h2 class="text-lg  text-gray-600 font-semibold">{{ title }}</h2>
        </div>

        <div class="flex items-end space-x-4">
            <div class="text-3xl font-semibold text-primary ">
                {{ amount}}
            </div>

            <div class="text-sm pb-1 text-gray-400">Code</div>
        </div>

    </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
    title: string;
    amount: string;
 }>();
</script>

<style></style>
