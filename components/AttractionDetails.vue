<template>
    <div class="bg-white bg-opacity-10 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300 cursor-pointer"
        @click="focusAttraction(attraction)">
        <div class="carousel w-full aspect-[4/3]">
            <div v-for="(photo, index) in attraction.photos?.slice(1)" :key="index" :id="`slide${index}`" class="carousel-item relative w-full">
                <img :src="photo.getUrl({ maxWidth: 400, maxHeight: 300 })" class="w-full h-full object-cover" alt="Additional photo" loading="lazy">
                <div class="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white p-2 w-full text-center line-clamp-2">
                    {{ attraction.reviews[index]?.text }}
                </div>
            </div>
        </div>
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
            <div class="flex justify-between items-center mt-2">
                <button @click.stop="toggleAttractionInItinerary(attraction)"
                    :class="{ 'btn-success': attraction.inItinerary, 'btn-primary': !attraction.inItinerary }"
                    class="btn btn-sm">
                    <i class="material-icons align-middle mr-1">{{ attraction.inItinerary ? 'remove_circle' : 'add_circle' }}</i>
                    {{ attraction.inItinerary ? 'Remove' : 'Add' }}
                </button>
                <button @click.stop="openInGoogleMaps(attraction)" class="btn btn-sm btn-secondary">
                    <i class="material-icons align-middle mr-1">map</i>
                    Open in Maps
                </button>
            </div>
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

const openInGoogleMaps = (attraction) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(attraction.name)}&query_place_id=${attraction.id}`
    window.open(url, '_blank')
}
const focusAttraction = (attraction) => {
    //state.activeView = 'map'
    map.panTo(attraction.location)
   // globalThis.map.setZoom(15)
}

const toggleAttractionInItinerary = (attraction) => {
    const index = state._selectedAttractions.indexOf(attraction.id)
    if (index === -1) {
        state._selectedAttractions.push(attraction.id)
    } else {
        state._selectedAttractions.splice(index, 1)
    }
    map.panTo(attraction.location)
    createMarker(attraction)
    updateDistances()
    if (!state._selectedAttractions.includes(attraction.id))
        calculateDirections()
    if (state._selectedAttractions.length === 0) {
        state.activeView = 'map'
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
}


const createMarker = (attraction) => { 
    const marker = new google.maps.Marker({
        map: map,
        position: attraction.location,
        title: attraction.name,
        animation: google.maps.Animation.DROP,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: attraction.inItinerary ? '#4CAF50' : '#FFA500',
            fillOpacity: 0.9,
            strokeWeight: 0
        }
    })

    state.markers.push(marker)
    
}
</script>
