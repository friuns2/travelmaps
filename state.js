import { HookRouter } from '~/utils/reactive.js';
import { reactive } from 'vue'

import { toRaw } from 'vue';
import { useRouter } from 'vue-router';
globalThis.getRawState = () => toRaw(getState());
let State = {

    /**  @type {Array<ReturnType<typeof Attraction>>} */
    attractions: [],
    _minRatingsCount: 10,
    activeView: 'map',
    showItinerary: false,
    _sortOrder: 'distance',
    _homeLocation:undefined,
    _title: '',
    showModal: false,
    markers: [],
    autocomplete: null,
    _selectedAttractions: [] ,
    /** @type {'attraction' | 'food'} */
    _placeType: 'attraction',
    
};



/** @param {google.maps.places.PlaceResult} details */
export const Attraction = (details,{distance,type}) => {
    return {
        id: details.place_id,
        name: details.name,
        rating: details.rating,
        user_ratings_total: details.user_ratings_total,
        address: details.vicinity,
        reviews: details.reviews,
        photos: details.photos,
        location: details.geometry.location,
        get inItinerary() {
            return getState()._selectedAttractions.includes(this.id);
        },
        distance: distance,
        type: type
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
