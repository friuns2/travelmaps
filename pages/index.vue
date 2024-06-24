<template>
  <div class="min-h-screen bg-gradient-to-br from-teal-400 to-indigo-600 text-white p-4 md:p-8 overflow-hidden">
    <h1 @click="toggleModal" class="text-4xl md:text-5xl font-bold mb-6 text-center animate-fade-in-down cursor-pointer">Bali Attractions</h1>
    <div :class="{ 'hidden': !showModal }" class="fixed inset-0 flex items-center justify-center z-50">
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
    <div class="mb-8 bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-md">
      <label for="minRatingsCount" class="block text-lg font-medium mb-2">Minimum Ratings Count:</label>
      <div class="flex items-center">
        <input type="range" id="minRatingsCount" v-model="minRatingsCount" min="0" max="1000" step="10"
          class="w-full mr-4 accent-teal-500">
        <span class="text-xl font-semibold">{{ minRatingsCount }}</span>
      </div>
    </div>
    <div class="md:hidden">
      <button @click="ActiveView('list')" :class="{ 'bg-teal-500': activeView === 'list' }"
        class="px-4 py-2 rounded-l-lg">
        <i class="material-icons">list</i>
      </button>
      <button @click="ActiveView('map')" :class="{ 'bg-teal-500': activeView === 'map' }"
        class="px-4 py-2 rounded-r-lg">
        <i class="material-icons">map</i>
      </button>
    </div>
    <MapComponent :homeLocation="homeLocation" :attractions="attractions" />
    <AttractionListComponent :sortedAttractions="sortedAttractions" :focusAttraction="focusAttraction" :toggleAttractionInItinerary="toggleAttractionInItinerary" />
    <ItineraryComponent :attractions="attractions" :calculateDirections="calculateDirections" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { getCurrentInstance } from 'vue';
import MapComponent from '../components/MapComponent.vue';
import AttractionListComponent from '../components/AttractionListComponent.vue';
import ItineraryComponent from '../components/ItineraryComponent.vue';

const attractions = ref([]);
const minRatingsCount = ref(0);
const activeView = ref('list');
const showModal = ref(false);
const autocompleteInput = ref(null);
let autocomplete = null;

function toggleModal() {
  showModal.value = !showModal.value;
  if (showModal.value) {
    nextTick(() => {
      autocompleteInput.value.focus();
    });
  }
}

function setNewLocation() {
  if (autocomplete) {
    const place = autocomplete.getPlace();
    if (place && place.geometry) {
      homeLocation.value = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      };
      toggleModal();
      
      // Update the title with the new location name
      if (place.name) {
        document.title = `Attractions in ${place.name}`;
        document.querySelector('h1').textContent = `${place.name} Attractions`;
      }
    }
  }
}

const filteredAttractions = computed(() => {
    return attractions.value.filter(attraction => attraction.user_ratings_total >= minRatingsCount.value);
});

const displayedAttractions = computed(() => 
    filteredAttractions.value.filter(attraction => 
        showItinerary.value === attraction.inItinerary
    )
);

const hasItineraryItems = computed(() => {
    return attractions.value.some(attraction => attraction.inItinerary);
});

const sortedAttractions = computed(() => {
    return [...displayedAttractions.value].sort((a, b) => {
        if (sortOrder.value === 'relativity') {
            return 0; // Maintain initial order
        } else if (sortOrder.value === 'popularity') {
            return b.user_ratings_total - a.user_ratings_total;
        } else {
            return a.distance - b.distance;
        }
    });
});

function ActiveView(view) {
    activeView.value = view;
}

onMounted(() => {
    globalThis.vue = getCurrentInstance().setupState;
    if (window.google) {
        initMap();
    }
});

</script>
