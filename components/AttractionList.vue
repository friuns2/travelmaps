<template>
  <div>
    <div class="mb-4 flex justify-between items-center">
      <div>
        <label for="sortOrder" class="mr-2 text-white">Sort by:</label>
        <select id="sortOrder" v-model="state._sortOrder" class="bg-white bg-opacity-20 rounded-lg px-2 py-1 text-white">
          <option value="relativity" class="text-black">Relativity</option>
          <option value="popularity" class="text-black">Popularity</option>
          <option value="distance" class="text-black">Distance</option>
        </select>
      </div>
      <button v-if="hasItineraryItems" @click="toggleItinerary" class="btn btn-primary btn-sm text-white glass">
        <i class="material-icons mr-2 text-xl">{{ state.showItinerary ? 'view_list' : 'directions' }}</i>
        <span>{{ state.showItinerary ? `Show All (${filteredAttractions.length})` : `Show Itinerary (${state._selectedAttractions.length})` }}</span>
      </button>
    </div>
    <div class="flex flex-wrap justify-between items-center mb-4">
      <div class="flex-grow mx-4 mb-4">
        <label for="placeType" class="block text-sm font-medium mb-1">Place Type:</label>
        <select id="placeType" v-model="state._placeType" class="select select-primary w-full max-w-xs">
          <option value="attraction">Attractions</option>
          <option value="food">Restaurants</option>
        </select>
      </div>
      <div class="flex-grow mx-4">
        <label for="minRatingsCount" class="block text-sm font-medium mb-1">Minimum Ratings Count:</label>
        <div class="flex items-center space-x-2">
          <input type="range" id="minRatingsCount" min="0" max="1000" v-model="state._minRatingsCount" class="range range-sm range-primary flex-grow" />
          <span class="badge badge-primary badge-outline min-w-[3rem] text-center">{{ state._minRatingsCount }}</span>
        </div>
      </div>
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
  return state.attractions.filter(attraction => attraction.user_ratings_total >= state._minRatingsCount)
})

const displayedAttractions = computed(() => 
  filteredAttractions.value.filter(attraction => 
    state.showItinerary === state._selectedAttractions.includes(attraction.name)
  )
)

const hasItineraryItems = computed(() => {
  return state._selectedAttractions.length > 0
})

watch(hasItineraryItems, () => {
  if(!hasItineraryItems.value)
    state.showItinerary = false
})
const sortedAttractions = computed(() => {
  return [...displayedAttractions.value].sort((a, b) => {
    if (state._sortOrder === 'relativity') {
      return 0
    } else if (state._sortOrder === 'popularity') {
      return b.user_ratings_total - a.user_ratings_total
    } else {
      return a.distance - b.distance
    }
  })
})
const toggleItinerary = () => {
  state.showItinerary = !state.showItinerary  
}
watch(() => [state.showItinerary, state._selectedAttractions.length], (newValue) => {
  
    globalThis.calculateDirections()
    globalThis.updateDistances()
  
})



globalThis.updateDistances = () => {
  const itineraryAttractions = state.attractions.filter(a => state._selectedAttractions.includes(a.name))
  state.attractions.forEach(attraction => {
    if (state._selectedAttractions.includes(attraction.name)) {
      attraction.distance = 0
    } else {
      let minDistance = globalThis.calculateDistance(state._homeLocation, attraction.location)
      itineraryAttractions.forEach(itineraryAttraction => {
        const distanceToItinerary = globalThis.calculateDistance(itineraryAttraction.location, attraction.location)
        if (distanceToItinerary < minDistance) {
          minDistance = distanceToItinerary
        }
      })
      attraction.distance = minDistance
    }
  })
}
globalThis.calculateDistance = (point1, point2) => {
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
