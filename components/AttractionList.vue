<template>
    <div>
        <div class="mb-4 flex justify-between items-center">
          
            <button v-if="hasItineraryItems" @click="toggleItinerary" class="btn btn-primary btn-sm text-white glass">
                <i class="material-icons mr-2 text-xl">{{ state.showItinerary ? 'view_list' : 'directions' }}</i>
                <span>{{ state.showItinerary ? `Show All (${state.attractions.length})` : `Show Itinerary (${state._selectedAttractions.length})` }}</span>
            </button>
        </div>
        <div v-if="!state.showItinerary" class="flex flex-wrap justify-between items-center mb-4">
          
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
                    :attraction="attraction" />
            </TransitionGroup>
        </div>
        <div class="mt-4 flex justify-end">
            <button v-if="hasItineraryItems" @click="openInGoogleMaps" class="btn btn-secondary btn-sm text-white">
                <i class="material-icons mr-2 text-xl">map</i>
                <span>Open Route in Google Maps</span>
            </button>
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue'
import { getState } from '../state.js'
import AttractionDetails from './AttractionDetails.vue'

const state = getState()
const openInGoogleMaps = () => {
    const baseUrl = 'https://www.google.com/maps/dir/?api=1'
    const origin = `&origin=${state._homeLocation.lat},${state._homeLocation.lng}`

    const lastAttraction = state.attractions.find(attraction => attraction.id === state._selectedAttractions[state._selectedAttractions.length - 1])
    const destination = lastAttraction ? `&destination=${lastAttraction.location.lat()},${lastAttraction.location.lng()}` : ''

    const waypoints = state._selectedAttractions.slice(0, -1).map(id => {
        const attraction = state.attractions.find(attraction => attraction.id === id)
        if (attraction && attraction.location) {
            return `${attraction.location.lat()},${attraction.location.lng()}`
        }
    }).filter(Boolean).join('|')

    const waypointsParam = waypoints ? `&waypoints=${encodeURIComponent(waypoints)}` : ''
    const url = `${baseUrl}${origin}${destination}${waypointsParam}`
    window.open(url, '_blank')
}
const filteredAttractions = computed(() => {
    return state.attractions.filter(attraction => 
        attraction.user_ratings_total >= state._minRatingsCount && 
        (state._selectedAttractions.includes(attraction.id) == state.showItinerary && (state.showItinerary || attraction.type === state._placeType))
    )
})


const hasItineraryItems = computed(() => {
    return state._selectedAttractions.length > 0
})

watch(hasItineraryItems, () => {
    if (!hasItineraryItems.value)
        state.showItinerary = false
})
const sortedAttractions = computed(() => {
    return [...filteredAttractions.value].sort((a, b) => {
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
    const itineraryAttractions = state.attractions.filter(a => state._selectedAttractions.includes(a.id))
    for (const attraction of state.attractions) {
        if (state._selectedAttractions.includes(attraction.id)) {
            // Get distance from directions data
            const leg = state.directionsResult?.routes[0]?.legs.find(leg =>
                leg.end_location.lat() === attraction.location.lat() &&
                leg.end_location.lng() === attraction.location.lng()
            )
            if (leg)
                attraction.distance = leg.distance.value / 1000;
        } else {
            let minDistance = globalThis.calculateDistance(state._homeLocation, attraction.location)
            for (const itineraryAttraction of itineraryAttractions) {
                const distanceToItinerary = globalThis.calculateDistance(itineraryAttraction.location, attraction.location)
                if (distanceToItinerary < minDistance) {
                    minDistance = distanceToItinerary
                }
            }
            attraction.distance = minDistance
        }
    }
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
