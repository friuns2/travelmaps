import { reactive } from 'vue'
import { useState } from 'nuxt/app'

export const getState = () => {
  return reactive({
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
}

export const useComputedState = () => {
  const state = getState()

  const filteredAttractions = computed(() => {
    return state.value.attractions.filter(attraction => attraction.user_ratings_total >= state.value.minRatingsCount)
  })

  const displayedAttractions = computed(() => 
    filteredAttractions.value.filter(attraction => 
      state.value.showItinerary === attraction.inItinerary
    )
  )

  const hasItineraryItems = computed(() => {
    return state.value.attractions.some(attraction => attraction.inItinerary)
  })

  const sortedAttractions = computed(() => {
    return [...displayedAttractions.value].sort((a, b) => {
      if (state.value.sortOrder === 'relativity') {
        return 0
      } else if (state.value.sortOrder === 'popularity') {
        return b.user_ratings_total - a.user_ratings_total
      } else {
        return a.distance - b.distance
      }
    })
  })

  return {
    filteredAttractions,
    displayedAttractions,
    hasItineraryItems,
    sortedAttractions
  }
}
