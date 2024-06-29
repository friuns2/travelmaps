<template>
    <div id="map" class="h-[calc(100vh-200px)] rounded-lg shadow-lg"></div>
</template>
<script setup>
import { onMounted, watch } from 'vue'
import { Attraction, getState, initMap, clearMarkers, calculateDirections, updateAttractions, focusAttraction, placeHomeMarker } from '../utils'
let state = getState();

onMounted(() => {
    if (window.google) {
        initMap()
    }
})

</script>
