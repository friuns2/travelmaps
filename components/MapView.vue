<template>
  <div id="map" class="h-[calc(100vh-200px)] rounded-lg shadow-lg"></div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { getState } from '../state'

const state = getState()

const initMap = globalThis.initMap = () => {
  state.map = new google.maps.Map(document.getElementById('map'), {
    center: state.homeLocation,
    zoom: 12,
  })

  state.infowindow = new google.maps.InfoWindow()
  state.directionsService = new google.maps.DirectionsService()
  state.directionsRenderer = new google.maps.DirectionsRenderer()
  state.directionsRenderer.setMap(state.map)

  state.map.addListener('idle', () => {
    updateAttractions()
  })

  const homeIcon = {
    url: 'https://maps.google.com/mapfiles/kml/shapes/homegardenbusiness.png',
    scaledSize: new google.maps.Size(40, 40),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(20, 40)
  }

  new google.maps.Marker({
    position: state.homeLocation,
    map: state.map,
    icon: homeIcon,
    title: 'Bali'
  })
}


globalThis.calculateDirections = () => {
    const itineraryAttractions = state.attractions.filter(a => a.inItinerary)
    if (itineraryAttractions.length < 2) return

    const origin = itineraryAttractions[0].location
    const destination = itineraryAttractions[itineraryAttractions.length - 1].location
    const waypoints = itineraryAttractions.slice(1, -1).map(a => ({
        location: a.location,
        stopover: true
    }))

    state.directionsService.route({
        origin: origin,
        destination: destination,
        waypoints: waypoints,
        optimizeWaypoints: true,
        travelMode: 'DRIVING'
    }, (result, status) => {
        if (status === 'OK') {
            state.directionsRenderer.setDirections(result)
        }
    })
}


const updateAttractions = () => {
  const bounds = state.map.getBounds()
  const center = state.map.getCenter()

  const service = new google.maps.places.PlacesService(state.map)

  service.nearbySearch({
    location: center,
    radius: 20000,
    type: ['tourist_attraction']
  }, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      results.forEach(place => {
        if (!state.attractions.some(a => a.name === place.name)) {
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
                distance: calculateDistance(state.homeLocation, details.geometry.location)
              }
              state.attractions.push(attraction)
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
    map: state.map,
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

  marker.addListener('click', function () {
    focusAttraction(attraction)
  })
}

const focusAttraction = (attraction) => {
  state.map.panTo(attraction.location)
}

onMounted(() => {
  if (window.google) {
    initMap()
  }
})


</script>
