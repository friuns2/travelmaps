<template>
  <div id="map" class="h-[calc(100vh-200px)] rounded-lg shadow-lg"></div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { getState } from '../state'

const state = getState()

const initMap = () => {
  state.value.map = new google.maps.Map(document.getElementById('map'), {
    center: state.value.homeLocation,
    zoom: 12,
  })

  state.value.infowindow = new google.maps.InfoWindow()
  state.value.directionsService = new google.maps.DirectionsService()
  state.value.directionsRenderer = new google.maps.DirectionsRenderer()
  state.value.directionsRenderer.setMap(state.value.map)

  state.value.map.addListener('idle', () => {
    updateAttractions()
  })

  const homeIcon = {
    url: 'https://maps.google.com/mapfiles/kml/shapes/homegardenbusiness.png',
    scaledSize: new google.maps.Size(40, 40),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(20, 40)
  }

  new google.maps.Marker({
    position: state.value.homeLocation,
    map: state.value.map,
    icon: homeIcon,
    title: 'Bali'
  })
}

const updateAttractions = () => {
  const bounds = state.value.map.getBounds()
  const center = state.value.map.getCenter()

  const service = new google.maps.places.PlacesService(state.value.map)

  service.nearbySearch({
    location: center,
    radius: 20000,
    type: ['tourist_attraction']
  }, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      results.forEach(place => {
        if (!state.value.attractions.some(a => a.name === place.name)) {
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
                distance: calculateDistance(state.value.homeLocation, details.geometry.location)
              }
              state.value.attractions.push(attraction)
              createMarker(attraction)
            }
          })
        }
      })
    }
  })
}

const calculateDistance = (point1, point2) => {
  return google.maps.geometry.spherical.computeDistanceBetween(
    new google.maps.LatLng(point1),
    new google.maps.LatLng(point2)
  ) / 1000
}

const createMarker = (attraction) => {
  const marker = new google.maps.Marker({
    map: state.value.map,
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

  state.value.markers.push(marker)

  marker.addListener('click', function () {
    focusAttraction(attraction)
  })
}

const focusAttraction = (attraction) => {
  state.value.map.panTo(attraction.location)
}

onMounted(() => {
  if (window.google) {
    initMap()
  }
})

watch(() => state.value.attractions, (newAttractions) => {
  state.value.markers.forEach(marker => marker.setMap(null))
  state.value.markers = []
  newAttractions.forEach(attraction => createMarker(attraction))
}, { deep: true })
</script>
