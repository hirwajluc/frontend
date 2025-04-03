<template>
  <div class="  space-y-2 p-4 rounded-lg border-2 border-border">
    <h2 class="text-xl text-primary uppercase font-semibold">{{ title }}</h2>
    <div class="flex items-center justify-between space-x-2">
      <div v-if="props.isOne && leftValue == 0" class="text-center">
        <div class="text-xl">{{ leftTitle }}</div>
      </div>
      <div v-else class="text-left">
        <div v-if="!props.isOne" class="text-base text-gray-400 font-medium">{{ leftTitle }}
          <span v-if="title == 'Winners'" class="text-green-500"> {{Math.round(leftValue/(rightValue+leftValue)*100)}}%</span>
        </div>
        <div :class="[' font-semibold', props.isOne ? 'text-2xl mt-5' : ' text-xl']">{{ formatWithSeparator(leftValue) }}</div>
      </div>
      <div v-if="!props.isOne" class="text-right">
        <div class="text-base text-gray-400 font-medium">{{ rightTitle }}
          <span v-if="title == 'Winners'" class="text-green-500"> {{Math.round(rightValue/(rightValue+leftValue)*100)}}%</span>
        </div>
        <div class="text-xl font-semibold">{{ formatWithSeparator(rightValue) }}</div>
      </div>
    </div>


  </div>
</template>

<script lang="ts" setup>
const { formatWithSeparator } = useThousandSeparator()
const props = defineProps<{
  title: string;
  leftTitle: string;
  leftValue: any;
  rightTitle: string;
  rightValue: any;
  isOne: boolean;
}>();
</script>

<style></style>
