<template>
  <div class="itinerary">
    <h2 class="text-2xl font-bold mb-4">Your Itinerary</h2>
    <div v-if="attractions.length > 0">
      <div v-for="attraction in attractions" :key="attraction.name" class="attraction-item">
        <h3>{{ attraction.name }}</h3>
        <p>Distance: {{ attraction.distance.toFixed(2) }} km</p>
        <button @click="calculateDirections">Recalculate Directions</button>
      </div>
    </div>
    <div v-else>
      <p>Your itinerary is currently empty.</p>
    </div>
  </div>
</template>

<script setup>
import { defineProps, onMounted } from 'vue';

const props = defineProps({
  attractions: Array,
  calculateDirections: Function
});

onMounted(() => {
  // Initial directions calculation if there are attractions in the itinerary
  if (props.attractions.length > 0) {
    props.calculateDirections();
  }
});
</script>

<style scoped>
.itinerary {
  background-color: #f3f4f6;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.attraction-item + .attraction-item {
  margin-top: 16px;
}

.attraction-item h3 {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
}

.attraction-item p {
  margin: 4px 0;
  font-size: 16px;
}
</style>
