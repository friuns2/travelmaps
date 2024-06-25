<template>
  <div>
    <div class="mb-4 flex justify-between items-center">
      <div>
        <label for="sortOrder" class="mr-2 text-white">Sort by:</label>
        <select id="sortOrder" v-model="state.sortOrder" class="bg-white bg-opacity-20 rounded-lg px-2 py-1 text-white">
          <option value="relativity" class="text-black">Relativity</option>
          <option value="popularity" class="text-black">Popularity</option>
          <option value="distance" class="text-black">Distance</option>
        </select>
      </div>
      <button v-if="hasItineraryItems" @click="toggleItinerary" class="btn btn-primary btn-sm text-white glass">
        <i class="material-icons mr-2 text-xl">{{ state.showItinerary ? 'view_list' : 'directions' }}</i>
        <span>{{ state.showItinerary ? 'Show All' : 'Show Itinerary' }}</span>
      </button>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6" id="attraction-grid">
      <TransitionGroup name="attraction-list">
        <AttractionDetails
          v-for="attraction in sortedAttractions"
          :key="attraction.name"
          :attraction="attraction"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getState } from '../state.js'
import AttractionDetails from './AttractionDetails.vue'

const state = getState()

const filteredAttractions = computed(() => {
  return state.attractions.filter(attraction => attraction.user_ratings_total >= state.minRatingsCount)
})

const displayedAttractions = computed(() => 
  filteredAttractions.value.filter(attraction => 
    state.showItinerary === attraction.inItinerary
  )
)

const hasItineraryItems = computed(() => {
  return state.attractions.some(attraction => attraction.inItinerary)
})

const sortedAttractions = computed(() => {
  return [...displayedAttractions.value].sort((a, b) => {
    if (state.sortOrder === 'relativity') {
      return 0
    } else if (state.sortOrder === 'popularity') {
      return b.user_ratings_total - a.user_ratings_total
    } else {
      return a.distance - b.distance
    }
  })
})
const toggleItinerary = () => {
  state.showItinerary = !state.showItinerary
  if (state.showItinerary) 
    calculateDirections()
  updateDistances()
}



const updateDistances = () => {
  const itineraryAttractions = state.attractions.filter(a => a.inItinerary)
  state.attractions.forEach(attraction => {
    if (attraction.inItinerary) {
      attraction.distance = 0
    } else {
      let minDistance = calculateDistance(state.homeLocation, attraction.location)
      itineraryAttractions.forEach(itineraryAttraction => {
        const distanceToItinerary = calculateDistance(itineraryAttraction.location, attraction.location)
        if (distanceToItinerary < minDistance) {
          minDistance = distanceToItinerary
        }
      })
      attraction.distance = minDistance
    }
  })
}

const calculateDistance = (point1, point2) => {
  return google.maps.geometry.spherical.computeDistanceBetween(
    new google.maps.LatLng(point1),
    new google.maps.LatLng(point2)
  ) / 1000
}
</script>

<style scoped>
.attraction-list-enter-active,
.attraction-list-leave-active {
  transition: all 0.5s ease;
}
.attraction-list-enter-from,
.attraction-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
