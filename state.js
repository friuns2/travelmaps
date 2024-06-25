import { reactive } from 'vue'
import { toRaw } from 'vue';
globalThis.getRawState = () => toRaw(getState());
globalThis.state = {
  attractions: [],
  minRatingsCount: 0,
  activeView: 'map',
  showItinerary: false,
  sortOrder: 'distance',
  homeLocation: { lat: -8.4095, lng: 115.1889 },
  showModal: false,
  map: null,
  infowindow: null,
  markers: [],
  directionsService: null,
  directionsRenderer: null,
  autocomplete: null
};

/** 
 * @returns {State} 
 */
export const getState = () => {
  if(!globalThis.state)
    globalThis.state = reactive(state)
  return globalThis.state;
}

