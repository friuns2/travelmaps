import { useState } from '#app'

// Global state management for attractions and home location
export const useGlobalState = () => {
  const attractions = useState('attractions', () => [])
  const homeLocation = useState('homeLocation', () => ({ lat: -8.4095, lng: 115.1889 }))

  return {
    attractions,
    homeLocation
  }
}
