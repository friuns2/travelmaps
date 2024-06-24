<template>
    <div :class="{ 'hidden md:block': activeView === 'map' }" class="md:w-1/2 md:pr-4">
        <div class="mb-4 flex justify-between items-center">
            <div>
                <label for="sortOrder" class="mr-2 text-white">Sort by:</label>
                <select id="sortOrder" v-model="sortOrder" class="bg-white bg-opacity-20 rounded-lg px-2 py-1 text-white">
                    <option value="relativity" class="text-black">Relativity</option>
                    <option value="popularity" class="text-black">Popularity</option>
                    <option value="distance" class="text-black">Distance</option>
                </select>
            </div>
            <button v-if="hasItineraryItems" @click="toggleItinerary" class="btn btn-primary btn-sm text-white glass">
                <i class="material-icons mr-2 text-xl">{{ showItinerary ? 'view_list' : 'directions' }}</i>
                <span>{{ showItinerary ? 'Show All' : 'Show Itinerary' }}</span>
            </button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6" id="attraction-grid">
            <TransitionGroup name="attraction-list">
                <div v-for="attraction in sortedAttractions" :key="attraction.name"
                    class="bg-white bg-opacity-10 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300 cursor-pointer"
                    @click="focusAttraction(attraction)">
                    <img :src="attraction.photoUrl" class="w-full h-48 object-cover" alt="Attraction photo">
                    <div class="p-4">
                        <h3 class="text-xl font-bold mb-2">{{ attraction.name }}</h3>
                        <p class="text-sm mb-1">
                            <i class="material-icons text-yellow-400 align-middle mr-1">star</i> {{ attraction.rating }} / 5
                        </p>
                        <p class="text-sm mb-1">
                            <i class="material-icons align-middle mr-1">people</i> {{ attraction.user_ratings_total }}
                        </p>
                        <p class="text-sm mb-1">
                            <i class="material-icons align-middle mr-1">location_on</i> {{ attraction.address }}
                        </p>
                        <p class="text-sm mb-1">
                            <i class="material-icons align-middle mr-1">directions_car</i> {{ attraction.distance.toFixed(2) }} km
                        </p>
                        <button @click.stop="toggleAttractionInItinerary(attraction)"
                            :class="{ 'bg-green-500': attraction.inItinerary, 'bg-blue-500': !attraction.inItinerary }"
                            class="mt-2 px-3 py-1 rounded-full text-white text-sm">
                            <i class="material-icons align-middle mr-1">{{ attraction.inItinerary ? 'remove_circle' : 'add_circle' }}</i> {{ attraction.inItinerary ? 'Remove from Itinerary' : 'Add to Itinerary' }} </button>
                    </div>
                </div>
            </TransitionGroup>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        attractions: Array,
        activeView: String,
        hasItineraryItems: Boolean,
        sortOrder: String,
        showItinerary: Boolean,
        focusAttraction: Function,
        toggleItinerary: Function,
        toggleAttractionInItinerary: Function,
        sortedAttractions: Array
    }
}
</script>

<style scoped>
.attraction-list-enter-active,
.attraction-list-leave-active {
  transition: all 0.5s ease;
}
.attraction-list-enter-from,
.attraction-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
