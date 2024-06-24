<template>
  <div class="min-h-screen bg-gradient-to-br from-teal-400 to-indigo-600 text-white p-4 md:p-8 overflow-hidden">
    <MapComponent :homeLocation="homeLocation" :attractions="attractions" />
    <AttractionListComponent :sortedAttractions="sortedAttractions" :focusAttraction="focusAttraction" :toggleAttractionInItinerary="toggleAttractionInItinerary" />
    <ItineraryComponent :attractions="attractions" :calculateDirections="calculateDirections" />
  </div>
</template>

<script setup>
import { useGlobalState } from '../composables/state';
import MapComponent from '../components/MapComponent.vue';
import AttractionListComponent from '../components/AttractionListComponent.vue';
import ItineraryComponent from '../components/ItineraryComponent.vue';

const { attractions, homeLocation } = useGlobalState();

const focusAttraction = (attraction) => {
  // Logic to focus on an attraction
};

const toggleAttractionInItinerary = (attraction) => {
  // Logic to toggle an attraction in the itinerary
};

const calculateDirections = () => {
  // Logic to calculate directions
};

const sortedAttractions = computed(() => {
  // Logic to return sorted attractions
});
</script>
