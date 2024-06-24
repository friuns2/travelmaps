<template>
  <div id="map" class="h-[calc(100vh-200px)] rounded-lg shadow-lg"></div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useGlobalState } from '../composables/state';

const props = defineProps({
  homeLocation: Object,
  attractions: Array
});

const { homeLocation, attractions } = useGlobalState();

let map, infowindow, markers = [], directionsService, directionsRenderer;

onMounted(() => {
  initMap();
});

watch(() => props.attractions, (newVal, oldVal) => {
  updateAttractions();
}, { deep: true });

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: props.homeLocation,
    zoom: 12,
  });

  infowindow = new google.maps.InfoWindow();
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);

  const homeIcon = {
    url: 'https://maps.google.com/mapfiles/kml/shapes/homegardenbusiness.png',
    scaledSize: new google.maps.Size(40, 40),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(20, 40)
  };

  new google.maps.Marker({
    position: props.homeLocation,
    map: map,
    icon: homeIcon,
    title: 'Home Location'
  });

  updateAttractions();
}

function updateAttractions() {
  clearMarkers();
  props.attractions.forEach(attraction => {
    createMarker(attraction);
  });
}

function clearMarkers() {
  markers.forEach(marker => marker.setMap(null));
  markers = [];
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
      fillColor: '#FFA500',
      fillOpacity: 0.9,
      strokeWeight: 0
    }
  });

  markers.push(marker);

  marker.addListener('click', () => {
    infowindow.setContent(attraction.name);
    infowindow.open(map, marker);
  });
}
</script>

<style scoped>
#map {
  width: 100%;
  height: 100%;
}
</style>
