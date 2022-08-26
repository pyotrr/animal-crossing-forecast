<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import makeRequest from "../utils/makeRequest";
import { Hemisphere } from "../utils/enums";
import FishInfo from "./FishInfo.vue";

type Fish = {
  image_url: string;
  name: string;
  catchphrases: string[];
  shadow_size: string;
  sell_nook: number;
  sell_cj: number;
  render_url: string;
};

const loading = ref(true);
const fishes = ref([]);
const selectedFish = ref(null);

onBeforeMount(() => {
  const currentHour = new Date().getHours();

  navigator.geolocation.getCurrentPosition((geoPos: GeolocationPosition) => {
    const hemisphere =
      geoPos.coords.latitude > 0 ? Hemisphere.north : Hemisphere.south;
    makeRequest("/fish", { month: "current" })
      .then((resp) => {
        const month = resp.month;
        const fishesThisMonth = resp[hemisphere];
        fishes.value = fishesThisMonth.filter((fish: any) => {
          const availability = fish[hemisphere];
          const availableTime = availability.times_by_month[month];
          if (availableTime === "All day") {
            return true;
          }
          const borderTimes = availableTime
            .split(/[-–&]/)
            .map((timeSegment: string) => {
              const number = Number(timeSegment.replace(/\D/g, ""));
              return timeSegment.includes("P") ? number + 12 : number;
            });
          for (let i = 0; i < borderTimes.length / 2; i++) {
            const timeIndex = i * 2;
            if (borderTimes[timeIndex] < borderTimes[timeIndex + 1]) {
              if (
                currentHour >= borderTimes[timeIndex] &&
                currentHour < borderTimes[timeIndex + 1]
              ) {
                return true;
              }
            } else {
              if (
                currentHour >= borderTimes[timeIndex] ||
                currentHour < borderTimes[timeIndex + 1]
              ) {
                return true;
              }
            }
          }
          return false;
        });
      })
      .finally(() => {
        loading.value = false;
      });
  });
});

const onClick = (fish: any) => {
  selectedFish.value = fish;
};
const clearSelection = () => {
  selectedFish.value = null;
};
</script>

<template>
  <div v-if="loading">loading...</div>
  <FishInfo
    v-if="selectedFish"
    :fish="selectedFish"
    :clear-selection="clearSelection"
  />
  <div v-if="!loading" class="fish-container">
    <button v-for="fish in fishes" class="fish" @click="onClick(fish)">
      <img :src="fish.image_url" :alt="fish.name" height="50" width="50" />
      <p class="name">{{ fish.name }}</p>
    </button>
  </div>
</template>

<style scoped>
.fish-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, 80px);
  gap: 0.75rem;
  background-color: #fffae4;
  border-radius: 100px;
  padding: 3rem;
  justify-content: space-evenly;
  width: 100%;
  overflow: visible;
}
img {
  border-radius: 50%;
  transition: transform 0.15s ease-in-out;
}
.fish {
  position: relative;
  cursor: pointer;
}
.name {
  position: absolute;
  pointer-events: none;
  visibility: hidden;
  border-radius: 50px;
  background-color: #0ab3a2;
  color: #fffae4;
  top: -4.5rem;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  padding: 0.5rem;
  font-size: 1.25rem;
  font-family: "Josefin Sans", sans-serif;
}
.fish:hover > .name {
  visibility: visible;
}
.fish:hover > img {
  background-color: #0ab3a2;
  transform: scale(1.15);
}
@media screen and (max-width: 800px) {
  .fish-container {
    width: 100%;
    max-height: 90vh;
    padding: 0.75rem;
    grid-template-columns: repeat(auto-fill, 50px);
    gap: 0.5rem;
    border-radius: 25px;
    overflow-y: auto;
  }
  .name {
    display: none;
  }
}
</style>
