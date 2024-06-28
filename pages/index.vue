<template>
  <div class="min-h-screen bg-base-100 text-base-content p-4 md:p-8 overflow-hidden">
    <h1 @click="toggleModal" class="text-4xl md:text-5xl font-bold mb-6 text-center animate-fade-in-down cursor-pointer">Bali Explorer</h1>
    <LocationModal />
   
    <div class="md:hidden btn-group btn-group-horizontal w-full mb-4">
      <button @click="ActiveView('list')" :class="{ 'btn-active': state.activeView === 'list' }" class="btn btn-sm flex-1">
        <i class="material-icons mr-1">list</i> List
      </button>
      <button @click="ActiveView('map')" :class="{ 'btn-active': state.activeView === 'map' }" class="btn btn-sm flex-1">
        <i class="material-icons mr-1">map</i> Map
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