<template>
    <div class="bg-white bg-opacity-10 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300 cursor-pointer"
        @click="focusAttraction(attraction)">
        <img :src="attraction.photoUrl" class="w-full h-48 object-cover" alt="Attraction photo">
        <div class="p-4">
            <h3 class="text-xl font-bold mb-2">{{ attraction.name }}</h3>
            <p class="text-sm mb-1">
                <i class="material-icons text-yellow-400 align-middle mr-1">star</i> {{ attraction.rating }} / 5
            </p>
            <p class="text-sm mb-1">
                <i class="material-icons align-middle mr-1">people</i> {{ attraction.user_ratings_total }}
            </p>
            <p class="text-sm mb-1">
                <i class="material-icons align-middle mr-1">location_on</i> {{ attraction.address }}
            </p>
            <p class="text-sm mb-1">
                <i class="material-icons align-middle mr-1">directions_car</i> {{ attraction.distance.toFixed(2) }} km
            </p>
            <button @click.stop="toggleAttractionInItinerary(attraction)"
                :class="{ 'bg-green-500': attraction.inItinerary, 'bg-blue-500': !attraction.inItinerary }"
                class="mt-2 px-3 py-1 rounded-full text-white text-sm">
                <i class="material-icons align-middle mr-1">{{ attraction.inItinerary ? 'remove_circle' : 'add_circle' }}</i> {{ attraction.inItinerary ? 'Remove from Itinerary' : 'Add to Itinerary' }} </button>
        </div>
    </div>
</template>
<script setup>
import { getState } from '~/state'

const state = getState()

const props = defineProps({
    attraction: {
        type: Object,
        required: true
    }
})

const focusAttraction = (attraction) => {
    state.activeView = 'map'
    state.map.panTo(attraction.location)
}

const toggleAttractionInItinerary = (attraction) => {
    attraction.inItinerary = !attraction.inItinerary
    state.map.panTo(attraction.location)
    const marker = state.markers.find(marker => marker.getPosition().equals(attraction.location))
    marker.setIcon({
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: attraction.inItinerary ? '#4CAF50' : '#FFA500',
        fillOpacity: 0.9,
        strokeWeight: 0
    })
    updateDistances()
    if (!attraction.inItinerary)
        calculateDirections()
    if (!state.attractions.some(a => a.inItinerary)) {
        state.activeView = 'map'
    }
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
