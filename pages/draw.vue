<template>
  <div class="min-h-screen bg-green-100 relative flex justify-center items-center">
    <!-- Digit Animation -->
    <div class="flex space-x-4 animate-rain">
      <div v-for="(digit, index) in codeDigits" :key="index"
        class="text-4xl bg-green-500 text-white rounded-full h-16 w-16 flex items-center justify-center drop"
        :style="{ animationDelay: `${index * 0.5}s` }">
        {{ digit }}
      </div>
    </div>

    <!-- Winners List -->
    <div class="absolute bottom-5 left-5 text-white">
      <h2 class="text-lg font-semibold mb-3">Winners</h2>
      <ul class="space-y-2">
        <li v-for="winner in winners" :key="winner.name" class="flex items-center space-x-2">
          <div class="bg-blue-500 rounded-full h-8 w-8 flex items-center justify-center">
            {{ winner.initials }}
          </div>
          <span>{{ winner.name }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // Digits to animate
      codeDigits: [],

      // List of winners
      winners: [],
    };
  },
};
</script>

<style>
/* Add the raindrop animation effect */
@keyframes drop {
  0% {
    transform: translateY(-100%);
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.drop {
  animation: drop 1s ease-in-out forwards;
}
</style>
