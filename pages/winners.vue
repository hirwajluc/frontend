<template>
  <div class="min-h-screen bg-no-repeat bg-cover bg-center relative flex flex-col justify-center items-center">
    <!-- Digit Animation Container -->

    <img src="./../assets/images/bg-draw.gif" alt="" class="absolute left-0 right-0 h-full bg-cover w-full">
    <nuxt-link :to="showAnimate ? '#' : '/dashboard/trigger-draw'">
      <i class=" absolute top-7 left-10 pi pi-chevron-left text-green-800 hover:bg-green-100 rounded-lg p-3 m-3"></i>
    </nuxt-link>

    <h2 class="text-6xl py-1   z-20 border-primary font-bold absolute top-40 text-primary"> {{ prizeTypeTitle }} </h2>
    <img src="assets/images/Cap=citron.png" class="max-w-max absolute  h-20 w-20 left-60 top-20 opacity-80 "
      :class="showAnimate ? 'animate-spin animate-duration-10000' : ''" />
    <img src="assets/images/Cap=Fanta.png" class="max-w-max absolute  h-20 w-20 bottom-20 right-60 opacity-80 "
      :class="showAnimate ? 'animate-spin animate-duration-1000' : ''" />
    <img src="assets/images/Cap=cheetah.png" class="max-w-max absolute  h-20 w-20 left-80 bottom-40  opacity-80 "
      :class="showAnimate ? 'animate-spin animate-duration-1000' : ''" />
    <img src="assets/images/Cap=Vitalo.png" class="max-w-max absolute  h-20 w-20 bottom-64 left-2/3 opacity-80 "
      :class="showAnimate ? 'animate-spin ' : ''" />
    <img src="assets/images/Cap=Splite.png" class="max-w-max absolute  h-20 w-20 top-44 left-1/3 opacity-80 "
      :class="showAnimate ? 'animate-spin ' : ''" />
    <img src="assets/images/Cap=Krest.png" class="max-w-max absolute  h-20 w-20 right-10 top-1/3 opacity-80 "
      :class="showAnimate ? 'animate-spin ' : ''" />
    <img src="assets/images/Cap=Pineapple.png" class="max-w-max absolute  h-20 w-20 top-28 right-1/3 opacity-80 "
      :class="showAnimate ? 'animate-spin animate-duration-1000' : ''" />
    <img src="assets/images/Cap=Coke.png" class="max-w-max absolute  h-20 w-20 left-20 opacity-80 "
      :class="showAnimate ? 'animate-spin ' : ''" />


    <div class="relative mb-24">
      <!-- Placeholder cards (background) -->

      <div class="flex space-x-4 md:space-x-2">
        <div v-for="index in 10" :key="index"
          class="text-5xl  bg-gradient-to-t from-emerald-700  to-green-500  text-white font-black rounded-full h-28  w-28 flex items-center justify-center">
        </div>
      </div>

      <!-- Visible digits with animation -->
      <div class="absolute top-0 left-0 flex space-x-2">
        <div v-for="(digit, index) in visibleCodeDigits" :key="index"
          class="text-5xl bg-gradient-to-t from-emerald-700  to-green-500 text-white font-black  uppercase rounded-full  h-28  w-28   flex items-center justify-center">
          <div class="drop">{{ digit }}</div>
        </div>
      </div>
      <div v-if="showAnimate && remainingTime > 0" class="mt-10 text-center text-4xl font-bold text-primary">
        {{ formattedTime }}
      </div>
    </div>

    <!-- Winner's Name Display -->
    <div v-if="showWinner" class="absolute bottom-64 text-center drop">
      <h2 class="text-6xl  font-bold text-green-900">{{ currentWinner?.winner }}</h2>
    </div>

    <!-- Next Button -->
    <div class="absolute bottom-40 flex gap-x-10">
      <button @click="startButtonClicked" v-if="newWinners.length == 0 && !showAnimate"
        class="bg-green-900 text-white px-8 flex items-center py-4 rounded-lg font-bold">
        <i class="pi pi-play text-white mr-2"></i> Start Draw
      </button>

      <button v-if="showWinner && nextWinnerIndex < winners" @click="nextWinner"
        class="bg-emerald-900 text-white px-8 flex items-center py-4 rounded-lg font-bold">
        <i class="pi pi-refresh text-white mr-2"></i> Re-Start
      </button>
    </div>



    <!-- New Winners List -->
    <div class="absolute bottom-2 rounded-2xl left-20  p-4 right-20">
      <h2 class="text-2xl py-1   border-primary font-semibold mb-3 text-white"> Winners ({{
        newWinners.length }} - {{ winners }})</h2>
      <div class="flex gap-8 text-white font-semibold">
        <div v-for="(item, index) in newWinners" :key="item.id"
          class="font-bold flex items-center gap-x-3 text-lg slideLeft">
          <Badge :value="index + 1" severity="secondary"></Badge>
          <span> {{ item.winner }}</span>
          <!-- <Chip :label="item.winner" icon="pi pi-user" class="px-4" /> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, computed, onBeforeUnmount } from 'vue';
import type { Winner } from '~/types';
import confetti from 'canvas-confetti';
import { object, string } from 'yup';
import { httpRequest } from '~/services';


export default {
  setup() {
    const drawStore = useDrawStore();
    const priseStore = usePrizeStore();
    const winners = computed(() => {
      return priseStore.currentType?.elligibility
    });
    const prizeTypeId = computed(() => {
      return priseStore.currentType?.id
    });

    const prizeTypeTitle = computed(() => {
      return priseStore.currentType?.name;
    });
    const newWinners = ref<Winner[]>([]);
    const currentWinner = ref<Winner | null>(null);
    const visibleCodeDigits = ref<string[]>([]);
    const currentIndex = ref<number>(0);
    const showWinner = ref<boolean>(false);
    const showAnimate = ref<boolean>(false);
    const nextWinnerIndex = ref<number>(0);
    const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const intervalIds = ref<number[]>([]);

    // Countdown timer state
    const totalTime = ref<number>(0);
    const remainingTime = ref<number>(0);
    let countdownInterval: number | null = null;

    // Computed property to format remainingTime in 00:00:00 format
    const formattedTime = computed(() => {
      const hours = String(Math.floor(remainingTime.value / 3600)).padStart(2, '0');
      const minutes = String(Math.floor((remainingTime.value % 3600) / 60)).padStart(2, '0');
      const seconds = String(remainingTime.value % 60).padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
    });

    const toggleFullScreen = (): void => {
      const doc = document as any;
      const fullscreenElement = doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement;

      if (!fullscreenElement) {
        const docElm = document.documentElement;
        if (docElm.requestFullscreen) docElm.requestFullscreen();
        else if (docElm.mozRequestFullScreen) docElm.mozRequestFullScreen();
        else if (docElm.webkitRequestFullscreen) docElm.webkitRequestFullscreen();
        else if (docElm.msRequestFullscreen) docElm.msRequestFullscreen();
      }
    };
    const isSmallScreen = ref(false)

    const checkScreenSize = () => {
      isSmallScreen.value = window.innerWidth <= 768
    }

    onMounted(() => {
      checkScreenSize() // Initial check
      window.addEventListener('resize', checkScreenSize)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', checkScreenSize)
    })

    const exitFullScreen = (): void => {
      const doc = document as any;
      if (doc.exitFullscreen) doc.exitFullscreen();
      else if (doc.mozCancelFullScreen) doc.mozCancelFullScreen();
      else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen();
      else if (doc.msExitFullscreen) doc.msExitFullscreen();
    };

    onMounted(() => {
      toggleFullScreen();
    });

    onBeforeUnmount(() => {
      exitFullScreen();
    });

    const startDraw = (): void => {
      if (nextWinnerIndex.value < winners.value) {
        // currentWinner.value = winners.value[nextWinnerIndex.value];
        // visibleCodeDigits.value = Array(currentWinner.value.code.length).fill('');
        startDrawing({ "prize_type": prizeTypeId.value })
      }
    };

    const startDrawing = (data: any) => {
      httpRequest
        .post("/api/v1/draw", data)
        .then((res: any) => {
          if (res.status == 200) {
            // setWinners(res.winner);
            currentWinner.value = res.winner;
            visibleCodeDigits.value = Array(currentWinner.value.code.length).fill('');
            currentIndex.value = 0;
            showWinner.value = false;
            showAnimate.value = true;
            startRandomCharacterAnimation();
            revealDigitsSequentially();

            totalTime.value = currentWinner.value.code.length * 1.5;
            remainingTime.value = totalTime.value;
            startCountdown();
          }
        })
        .catch((error: any) => { })
        .finally(() => {
        });
    };

    const startRandomCharacterAnimation = (): void => {
      visibleCodeDigits.value.forEach((_, index) => {
        const intervalId = setInterval(() => {
          visibleCodeDigits.value[index] = randomChars[Math.floor(Math.random() * randomChars.length)];
        }, 100);
        intervalIds.value.push(intervalId);
      });
    };

    const revealDigitsSequentially = (): void => {
      if (currentWinner.value && currentIndex.value < currentWinner.value.code.length) {
        setTimeout(() => {
          clearInterval(intervalIds.value[currentIndex.value]);
          visibleCodeDigits.value[currentIndex.value] = currentWinner.value?.code[currentIndex.value] || '';
          currentIndex.value++;
          revealDigitsSequentially();
        }, 1500);
      } else {
        showWinner.value = true;
        showAnimate.value = false;
        intervalIds.value.forEach(clearInterval);
        intervalIds.value = [];
        stopCountdown();
        triggerConfetti();

        if (currentWinner.value) {
          newWinners.value.push(currentWinner.value);
        }
      }
    };

    const startCountdown = (): void => {
      if (countdownInterval) clearInterval(countdownInterval);
      countdownInterval = setInterval(() => {
        if (remainingTime.value > 0) {
          remainingTime.value -= 1;
        } else {
          clearInterval(countdownInterval);
        }
      }, 1000);
    };

    const stopCountdown = (): void => {
      if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
      }
    };

    const nextWinner = (): void => {
      nextWinnerIndex.value++;

      startDraw();
    };
    const alert = useAlertStore()
    const startButtonClicked = (): void => {

      if (winners.value != null) {

        startDraw();
      } else {
        alert.error("No winners found");
        navigateTo("/dashboard/trigger-draw")
      }

    };

    const triggerConfetti = (): void => {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        for (let i = 0; i < 4; i++) {
          confetti(
            Object.assign({}, defaults, {
              particleCount: 50,
              origin: {
                x: randomInRange(0.1, 0.9),
                y: randomInRange(0.1, 0.4),
              },
            })
          );
        }
      }, 200);
    };

    return {
      winners,
      newWinners,
      showWinner,
      currentWinner,
      visibleCodeDigits,
      currentIndex,
      nextWinnerIndex,
      showAnimate,
      nextWinner,
      startButtonClicked,
      triggerConfetti,
      totalTime,
      remainingTime,
      formattedTime, // Returning formatted time for use in the template
      prizeTypeTitle, isSmallScreen, checkScreenSize
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

  80% {
    opacity: 2;
  }

  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.drop {
  animation: drop 1s ease-in-out forwards;
}

@keyframes slideLeft {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }

  80% {
    opacity: 2;
  }

  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

.slideLeft {
  animation: slideLeft 1s ease-in-out forwards;
}
</style>
