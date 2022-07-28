<script setup lang="ts">
const { fish, clearSelection } = defineProps(["fish", "clearSelection"]);
const a = (e: PointerEvent) => {
  e.stopPropagation();
};
</script>

<template>
  <div class="background" @click="clearSelection">
    <div class="dialog" @click="a">
      <h1>{{ fish.name }}</h1>
      <img :src="fish.render_url" alt="fish" height="100" />
      <p>{{ `"${fish.catchphrases[0]}"` }}</p>
      <p>{{ `location: ${fish.location}` }}</p>
      <p>{{ `price: ${fish.sell_nook}` }}</p>
    </div>
  </div>
</template>

<style scoped>
.background {
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  backdrop-filter: blur(10px);
  z-index: 2;
}

.dialog {
  border-radius: 15px;
  background-color: #fffae4;
  min-height: 100px;
  min-width: 150px;
  max-height: 85vh;
  max-width: 85vw;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  padding: 3rem;
}
.dialog h1 {
  font-size: 2rem;
  font-family: "Josefin Sans", sans-serif;
  color: #242424;
  margin-top: 0;
}

.dialog img {
  max-height: 100px;
  margin-bottom: 1rem;
}

.dialog p:first-of-type {
  color: #242424;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  font-style: italic;
}

.dialog p {
  color: #242424;
  font-size: 1.25rem;
  margin: 0 0 0.5rem 0;
}
</style>
