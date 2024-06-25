<template>
    <div class="min-h-screen bg-gradient-to-br from-teal-400 to-indigo-600 text-white p-4 md:p-8 overflow-hidden">
      <h1 @click="toggleModal" class="text-4xl md:text-5xl font-bold mb-6 text-center animate-fade-in-down cursor-pointer">Bali Attractions</h1>
      <LocationModal />
      <div class="mb-8 bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-md">
        <label for="minRatingsCount" class="block text-lg font-medium mb-2">Minimum Ratings Count:</label>
        <div class="flex items-center">
          <input type="range" id="minRatingsCount" v-model="state.minRatingsCount" min="0" max="1000" step="10"
                 class="w-full mr-4 accent-teal-500">
          <span class="text-xl font-semibold">{{ state.minRatingsCount }}</span>
        </div>
      </div>
      <div class="md:hidden">
        <button @click="ActiveView('list')" :class="{ 'bg-teal-500': state.activeView === 'list' }"
                class="px-4 py-2 rounded-l-lg">
          <i class="material-icons">list</i>
        </button>
        <button @click="ActiveView('map')" :class="{ 'bg-teal-500': state.activeView === 'map' }"
                class="px-4 py-2 rounded-r-lg">
          <i class="material-icons">map</i>
        </button>
      </div>
      <div class="md:flex">
        <div :class="{ 'hidden md:block': state.activeView === 'map' }" class="md:w-1/2 md:pr-4">
          <AttractionList />
        </div>
        <div :class="{ 'hidden md:block': state.activeView === 'list' }" class="md:w-1/2 md:pl-4">
          <MapView />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { getState } from '../state.js'
  import AttractionList from '../components/AttractionList.vue'
  import MapView from '../components/MapView.vue'
  import LocationModal from '../components/LocationModal.vue'
  
  const state = getState()
  
  const toggleModal = () => {
    state.showModal = !state.showModal
  }
  
  const ActiveView = (view) => {
    state.activeView = view
    if (view === 'map') {
      globalThis.calculateDirections()
    }
  }

  </script>
  
  <style>
  @import './styles.css';
  </style>