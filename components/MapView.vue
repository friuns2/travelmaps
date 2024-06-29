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
/** @type {google.maps.places.PlacesService} */
let service;
/** @type {google.maps.Map} */
globalThis.map;
onMounted(() => {
    if (window.google) {
        nextTick(() => {
            initMap()
        })
    }
})

const initMap = globalThis.initMap = () => {
    directionsService = new google.maps.DirectionsService()
    directionsRenderer = new google.maps.DirectionsRenderer()
    globalThis.map = new google.maps.Map(document.getElementById('map'), {
        center: state._homeLocation || { lat: -8.3405, lng: 115.0920 },
        zoom: 12,gestureHandling: "greedy"
    })
    service = new google.maps.places.PlacesService(globalThis.map)


    directionsRenderer.setMap(globalThis.map)

    globalThis.map.addListener('idle', () => {
        updateAttractions()
    })
 
    
    if (!state._homeLocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => globalThis.updateLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            }),
            () => fetch('https://ipapi.co/json/')
                .then(response => response.json())
                .then(data => globalThis.updateLocation({
                    lat: data.latitude,
                    lng: data.longitude
                }, data.city))
                .catch(() => alert('Unable to get location. Please enter manually.'))
        );
    }else{
        globalThis.placeHomeMarker();
        setTimeout(() => {
            globalThis.calculateDirections();
        }, 500); // Add a 1-second delay
    }


}
watch(() => state._placeType, () => {
    updateAttractions()
})

globalThis.clearMarkers = () => {
  state.markers.forEach(marker => {
    marker.setVisible(false)
    marker.setMap(null)
  })
  state.markers = []
  state.attractions = []
  directionsRenderer.setDirections({ routes: [] })
  state.showItinerary = false
  
}
//watch(() => state.showItinerary, async () => {globalThis.calculateDirections()})


globalThis.calculateDirections = async () => {
    for (const id of state._selectedAttractions) {
        const attraction = state.attractions.find(attraction => attraction.id === id)
        if (!attraction && service) {
            const details = await new Promise((resolve, reject) => {
                service.getDetails({ placeId: id }, (details, status) => {
                    status === google.maps.places.PlacesServiceStatus.OK ? resolve(details) : reject(status);
                });
            });

            const attractionType = details.types.includes('restaurant') ? 'food' : 'attraction'
            state.attractions.push(Attraction(details, {
                distance: globalThis.calculateDistance(state._homeLocation, details.geometry.location),
                type: attractionType
            }));
        }
    }

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
    const bounds = globalThis.map.getBounds()
    if(!bounds)return;
    let request = {
        bounds: bounds,
    }

    if (state._placeType === 'food') {
        request.type = ['restaurant']
        request.keyword = ['restaurant']
    } else {
        request.type = ['tourist_attraction']
        request.keyword = undefined;
    }

    service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (const place of results) {
                if (!state.attractions.some(a => a.id === place.place_id)) {
                    service.getDetails({ placeId: place.place_id }, (details, status) => {
                        if (status === google.maps.places.PlacesServiceStatus.OK) {
                            const attraction = Attraction(details, { distance: globalThis.calculateDistance(state._homeLocation, details.geometry.location),type: state._placeType })
                            if (!state.attractions.some(a => a.id === attraction.id)) {
                                state.attractions.push(attraction)
                            }
                            
                        }
                    })
                }
            }//remove duplicates
            
        }
    })
}



const focusAttraction = (attraction) => {
    globalThis.map.panTo(attraction.location)
}


</script>
