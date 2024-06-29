// Function to update the location and refresh the map view
export const updateLocation = (location, placeName = 'Current Location') => {
    const state = getState();
    state._homeLocation = {
        lat: typeof location.lat === 'function' ? location.lat() : location.lat,
        lng: typeof location.lng === 'function' ? location.lng() : location.lng
    };
    globalThis.map.setCenter(location);
    state._selectedAttractions = [];
    clearMarkers();
    state._title = `${placeName}`;
    placeHomeMarker();
};

// Function to calculate directions between attractions
export const calculateDirections = () => {
    const state = getState();
    const itineraryAttractions = state.attractions.filter(a => a.inItinerary);
    if (itineraryAttractions.length === 0) return;

    const origin = state._homeLocation;
    const destination = itineraryAttractions[itineraryAttractions.length - 1].location;
    const waypoints = itineraryAttractions.map(a => ({
        location: a.location,
        stopover: true
    }));

    directionsService.route({
        origin: origin,
        destination: destination,
        waypoints: waypoints,
        optimizeWaypoints: true,
        travelMode: 'DRIVING'
    }, (result, status) => {
        if (status === 'OK') {
            directionsRenderer.setDirections(result);
        }
    });
};

// Function to clear all markers from the map
export const clearMarkers = () => {
    const state = getState();
    state.markers.forEach(marker => {
        marker.setVisible(false);
        marker.setMap(null);
    });
    state.markers = [];
    state.attractions = [];
    directionsRenderer.setDirections({ routes: [] });
    state.showItinerary = false;
};
