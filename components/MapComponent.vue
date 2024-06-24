<template>
  <div id="map" class="h-[calc(100vh-200px)] rounded-lg shadow-lg"></div>
</template>

<script setup>
import { ref, onMounted, watch, defineProps } from 'vue';

const props = defineProps({
  homeLocation: Object,
  attractions: Array
});

let map, infowindow, markers = [], directionsService, directionsRenderer;

const initMap = () => {
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
};

const updateAttractions = () => {
  const bounds = map.getBounds();
  const center = map.getCenter();

  const service = new google.maps.places.PlacesService(map);

  service.nearbySearch({
    location: center,
    radius: 20000,
    type: ['tourist_attraction']
  }, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      results.forEach(place => {
        if (!props.attractions.some(a => a.name === place.name)) {
          service.getDetails({ placeId: place.place_id }, (details, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              const attraction = {
                name: details.name,
                rating: details.rating,
                user_ratings_total: details.user_ratings_total,
                address: details.vicinity,
                photoUrl: details.photos ? details.photos[0].getUrl({ maxWidth: 500, maxHeight: 500 }) : '',
                location: details.geometry.location,
                inItinerary: false,
                distance: calculateDistance(props.homeLocation, details.geometry.location)
              };
              props.attractions.push(attraction);
              createMarker(attraction);
            }
          });
        }
      });
    }
  });
};

const calculateDistance = (point1, point2) => {
  return google.maps.geometry.spherical.computeDistanceBetween(
    new google.maps.LatLng(point1),
    new google.maps.LatLng(point2)
  ) / 1000; // Convert to kilometers
};

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
  });

  markers.push(marker);
};

const calculateDirections = () => {
  // This method will use props.attractions to calculate directions
  // Implementation depends on the specific requirements and is omitted for brevity
};

onMounted(() => {
  initMap();
});

watch(() => props.homeLocation, () => {
  initMap();
}, { deep: true });

watch(() => props.attractions, () => {
  updateAttractions();
}, { deep: true });
</script>

<style scoped>
#map {
  width: 100%;
  height: 100%;
}
</style>
