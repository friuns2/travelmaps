import { reactive } from 'vue'
import { useState } from 'nuxt/app'

export const getState = () => {
  if(!globalThis.state)
  globalThis.state= reactive({
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
  })
  return globalThis.state;
}

export const useComputedState = () => {
  if(globalThis.computedState) return globalThis.computedState;

  const state = getState()
  

  const filteredAttractions = computed(() => {
    return state.attractions.filter(attraction => attraction.user_ratings_total >= state.minRatingsCount)
  })

  const displayedAttractions = computed(() => 
    filteredAttractions.value.filter(attraction => 
      state.showItinerary === attraction.inItinerary
    )
  )

  const hasItineraryItems = computed(() => {
    return state.attractions.some(attraction => attraction.inItinerary)
  })

  const sortedAttractions = computed(() => {
    return [...displayedAttractions.value].sort((a, b) => {
      if (state.sortOrder === 'relativity') {
        return 0
      } else if (state.sortOrder === 'popularity') {
        return b.user_ratings_total - a.user_ratings_total
      } else {
        return a.distance - b.distance
      }
    })
  })

  return globalThis.computedState = {
    filteredAttractions,
    displayedAttractions,
    hasItineraryItems,
    sortedAttractions
  }
}
