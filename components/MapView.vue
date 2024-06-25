<template>
    <div id="map" class="h-[calc(100vh-200px)] rounded-lg shadow-lg"></div>
</template>

<script setup>
import { defineProps, onMounted } from 'vue';

const props = defineProps({
    homeLocation: Object,
    attractions: Array,
    focusAttraction: Function,
    calculateDirections: Function
});

let map, infowindow;

onMounted(() => {
    initMap();
});

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: props.homeLocation,
        zoom: 12,
    });

    infowindow = new google.maps.InfoWindow();

    props.attractions.forEach(attraction => {
        createMarker(attraction);
    });
}

function createMarker(attraction) {
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
    });

    marker.addListener('click', function () {
        props.focusAttraction(attraction);
    });
}
</script>
