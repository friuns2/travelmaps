<template>
    <div id="map" class="h-[calc(100vh-200px)] rounded-lg shadow-lg"></div>
</template>
<script setup>
import { onMounted, watch } from 'vue'
import { Attraction, getState } from '../state'
let state = getState();
/** @type {google.maps.DirectionsService} */
let directionsService;
/** @type {google.maps.DirectionsRenderer} */
let directionsRenderer;

const initMap = globalThis.initMap = () => {
    directionsService = new google.maps.DirectionsService()
    directionsRenderer = new google.maps.DirectionsRenderer()
    state.map = new google.maps.Map(document.getElementById('map'), {
        center: state._homeLocation,
        zoom: 12,
    })


    directionsRenderer.setMap(state.map)

    state.map.addListener('idle', () => {
        updateAttractions()
    })
    watch(() => state._placeType, () => {
        globalThis.clearMarkers()
        updateAttractions()
    })

    const homeIcon = {
        url: 'https://maps.google.com/mapfiles/kml/shapes/homegardenbusiness.png',
        scaledSize: new google.maps.Size(40, 40),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(20, 40)
    }

    new google.maps.Marker({
        position: state._homeLocation,
        map: state.map,
        icon: homeIcon,
        title: 'Bali'
    })
}

globalThis.clearMarkers = () => {
  state.markers.forEach(marker => marker.setMap(null))
  state.markers = []
  state.attractions = []
  directionsRenderer.setDirections({ routes: [] })
  state.showItinerary = false;
}

globalThis.calculateDirections = () => {
    const itineraryAttractions = state.attractions.filter(a => a.inItinerary)
    if (itineraryAttractions.length === 0) return

    const origin = state._homeLocation
    const destination = itineraryAttractions[itineraryAttractions.length - 1].location
    const waypoints = itineraryAttractions.map(a => ({
        location: a.location,
        stopover: true
    }))

    directionsService.route({
        origin: origin,
        destination: destination,
        waypoints: waypoints,
        optimizeWaypoints: true,
        travelMode: 'DRIVING'
    }, (result, status) => {
        if (status === 'OK') {
            directionsRenderer.setDirections(result)
        }
    })
}

const updateAttractions = () => {
    const bounds = state.map.getBounds()
    const service = new google.maps.places.PlacesService(state.map)

    let request = {
        bounds: bounds,
    }

    if (state._placeType === 'food') {
        request.type = undefined
        request.keyword = ['restaurant']
    } else {
        request.type = ['tourist_attraction']
        request.keyword = undefined;
    }

    service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            results.forEach(place => {
                if (!state.attractions.some(a => a.name === place.name)) {
                    service.getDetails({ placeId: place.place_id }, (details, status) => {
                        if (status === google.maps.places.PlacesServiceStatus.OK) {
                            const attraction = Attraction(details, { distance: globalThis.calculateDistance(state._homeLocation, details.geometry.location) })
                            state.attractions.push(attraction)
                            createMarker(attraction)
                        }
                    })
                }
            })
        }
    })
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
