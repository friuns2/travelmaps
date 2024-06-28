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
import { Attraction } from '~/state'

const state = getState()

defineProps({
    /** @type {import('vue').PropType<ReturnType<typeof Attraction>>} */
    attraction:
    {
        type: Object,
        required: true
    }
})

const focusAttraction = (attraction) => {
    state.activeView = 'map'
    globalThis.map.panTo(attraction.location)
}

const toggleAttractionInItinerary = (attraction) => {
    const index = state._selectedAttractions.indexOf(attraction.name)
    if (index === -1) {
        state._selectedAttractions.push(attraction.name)
    } else {
        state._selectedAttractions.splice(index, 1)
    }
    globalThis.map.panTo(attraction.location)
    const marker = state.markers.find(marker => marker.getPosition().equals(attraction.location))
    marker.setIcon({
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: state._selectedAttractions.includes(attraction.name) ? '#4CAF50' : '#FFA500',
        fillOpacity: 0.9,
        strokeWeight: 0
    })
    globalThis.updateDistances()
    if (!state._selectedAttractions.includes(attraction.name))
        globalThis.calculateDirections()
    if (state._selectedAttractions.length === 0) {
        state.activeView = 'map'
    }
}


</script>
