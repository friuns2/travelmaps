<template>
  <div class="itinerary">
    <h2 class="text-xl font-bold mb-4">Your Itinerary</h2>
    <div v-for="attraction in attractions" :key="attraction.name" class="itinerary-item">
      <h3>{{ attraction.name }}</h3>
      <p>Distance: {{ attraction.distance.toFixed(2) }} km</p>
      <button @click="calculateDirections">Recalculate Directions</button>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  attractions: Array,
  calculateDirections: Function
});
</script>

<style scoped>
.itinerary {
  display: flex;
  flex-direction: column;
}

.itinerary-item {
  margin-bottom: 1rem;
}

.itinerary-item h3 {
  margin: 0;
  font-size: 1.25rem;
}

.itinerary-item p {
  margin: 0.25rem 0;
}
</style>
