<template>
  <div class="attraction-list">
    <div v-for="attraction in sortedAttractions" :key="attraction.name" class="attraction-item" @click="focusAttraction(attraction)">
      <img :src="attraction.photoUrl" alt="Attraction photo" class="attraction-photo">
      <div class="attraction-info">
        <h3>{{ attraction.name }}</h3>
        <p>Rating: {{ attraction.rating }} / 5</p>
        <p>Total Ratings: {{ attraction.user_ratings_total }}</p>
        <button @click.stop="toggleAttractionInItinerary(attraction)">
          {{ attraction.inItinerary ? 'Remove from Itinerary' : 'Add to Itinerary' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  sortedAttractions: Array,
  focusAttraction: Function,
  toggleAttractionInItinerary: Function
});
</script>

<style scoped>
.attraction-list {
  display: flex;
  flex-direction: column;
}

.attraction-item {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  cursor: pointer;
}

.attraction-photo {
  width: 100px;
  height: 100px;
  object-fit: cover;
  margin-right: 1rem;
}

.attraction-info h3 {
  margin: 0;
  font-size: 1.25rem;
}

.attraction-info p {
  margin: 0.25rem 0;
}
</style>
