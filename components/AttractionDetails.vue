<template>
  <div class="attraction-details">
    <h2 class="text-2xl font-bold mb-4">Attraction Details</h2>
    <div v-if="selectedAttraction" class="bg-white bg-opacity-20 backdrop-blur-md p-8 rounded-lg shadow-lg">
      <img :src="selectedAttraction.photoUrl" class="w-full h-48 object-cover mb-4" alt="Attraction photo">
      <h3 class="text-xl font-bold mb-2">{{ selectedAttraction.name }}</h3>
      <p class="text-sm mb-1">
        <i class="material-icons text-yellow-400 align-middle mr-1">star</i> {{ selectedAttraction.rating }} / 5
      </p>
      <p class="text-sm mb-1">
        <i class="material-icons align-middle mr-1">people</i> {{ selectedAttraction.user_ratings_total }}
      </p>
      <p class="text-sm mb-1">
        <i class="material-icons align-middle mr-1">location_on</i> {{ selectedAttraction.address }}
      </p>
      <p class="text-sm mb-1">
        <i class="material-icons align-middle mr-1">directions_car</i> {{ selectedAttraction.distance.toFixed(2) }} km
      </p>
      <button @click="toggleAttractionInItinerary(selectedAttraction)"
        :class="{ 'bg-green-500': selectedAttraction.inItinerary, 'bg-blue-500': !selectedAttraction.inItinerary }"
        class="mt-2 px-3 py-1 rounded-full text-white text-sm">
        <i class="material-icons align-middle mr-1">{{ selectedAttraction.inItinerary ? 'remove_circle' : 'add_circle' }}</i> {{ selectedAttraction.inItinerary ? 'Remove from Itinerary' : 'Add to Itinerary' }}
      </button>
    </div>
    <div v-else class="text-center">
      <p>Select an attraction to view details.</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    selectedAttraction: Object,
    toggleAttractionInItinerary: Function
  }
}
</script>

<style scoped>
</style>
