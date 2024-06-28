<template>
  <div :class="{ 'hidden': !state.showModal }" class="fixed inset-0 flex items-center justify-center z-50">
    <div class="absolute inset-0 bg-black opacity-50" @click="toggleModal"></div>
    <div class="bg-white bg-opacity-20 backdrop-blur-md p-8 rounded-lg shadow-lg z-10 w-96">
      <h2 class="text-2xl font-bold mb-4">Set New Location</h2>
      <input
        ref="autocompleteInput"
        type="text"
        placeholder="Enter a location"
        class="input input-bordered w-full mb-4 bg-white bg-opacity-50 text-black"
        @keyup.enter="setNewLocation">
      <button @click="setNewLocation" class="btn btn-primary w-full text-white"> Set Location </button>
    </div>
  </div> 
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { getState } from '~/state'

const state = getState()
const autocompleteInput = ref(null)

const toggleModal = () => {
  state.showModal = !state.showModal
}

const setNewLocation = () => {
  const place = state.autocomplete.getPlace()
  if (place) {
    if (place && place.geometry) {
      updateLocation(place.geometry.location, place.name)
    }
  } else {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        updateLocation(location)
      },
      () => alert('Unable to get location. Please enter manually.')
    )
  }
}

const updateLocation = (location, placeName = 'Current Location') => {
  state._homeLocation = location
  state.map.setCenter(location)
  state._selectedAttractions = [];
  globalThis.clearMarkers()
  toggleModal()
  state._title = `Attractions near ${placeName}`
}
watch(() => state._title, (newValue) => {
  document.title = newValue
  document.querySelector('h1').textContent = newValue
})


setTimeout(() => {
  state.autocomplete = new google.maps.places.Autocomplete(
      autocompleteInput.value,
      { 
        types: ['geocode', 'establishment'],
        fields: ['place_id', 'geometry', 'name']
      }
    )
    globalThis.calculateDirections();
}, 1000);

watch(() => state.showModal, (newValue) => {
  if (newValue) {
    nextTick(() => {
      autocompleteInput.value.focus()
    })
  }
})
</script>
