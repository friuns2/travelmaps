import { HookRouter } from '~/utils/reactive.js';
import { reactive } from 'vue'

import { toRaw } from 'vue';
import { useRouter } from 'vue-router';
globalThis.getRawState = () => toRaw(getState());
let State = {

    /**  @type {Array<ReturnType<typeof Attraction>>} */
    attractions: [],
    _minRatingsCount: 0,
    activeView: 'map',
    showItinerary: false,
    _sortOrder: 'distance',
    _homeLocation: { lat: -8.4095, lng: 115.1889 },
    _title: '',
    showModal: false,
    map: null,
    markers: [],
    directionsService: null,
    directionsRenderer: null,
    autocomplete: null,
    _selectedAttractions: [] ,
    _placeType: 'attraction',
    
};



/** @param {google.maps.places.PlaceResult} details */
export const Attraction = (details,{distance}) => {
    return {
        name: details.name,
        rating: details.rating,
        user_ratings_total: details.user_ratings_total,
        address: details.vicinity,
        photoUrl: details.photos ? details.photos[0].getUrl({ maxWidth: 500, maxHeight: 500 }) : '',
        location: details.geometry.location,
        get inItinerary() {
            return getState()._selectedAttractions.includes(this.name);
        },
        distance: distance
    }
}


/** 
 * @returns {State} 
 */
export const getState = () => {
    if (!globalThis.state) {
        State = globalThis.state = reactive(State)
        let router = useRouter();
        nextTick(() => { //wait for watch initialized
            HookRouter(State, router);
        });
    }
    return globalThis.state;
}

