<template>
    <div>
      <h1>Travel Maps</h1>
      <div>
        <label for="location">Select Location:</label>
        <select v-model="selectedLocation" @change="fetchData">
          <option value="">Select a location</option>
          <option value="New York">New York</option>
          <option value="London">London</option>
          <option value="Tokyo">Tokyo</option>
        </select>
      </div>
      <div v-if="weather">
        <h2>Weather in {{ selectedLocation }}</h2>
        <p>Temperature: {{ weather.main.temp }}°C</p>
        <p>Weather: {{ weather.weather[0].description }}</p>
      </div>
      <div v-if="emergencyContacts">
        <h2>Emergency Contacts in {{ selectedLocation }}</h2>
        <p>Police: {{ emergencyContacts.police }}</p>
        <p>Ambulance: {{ emergencyContacts.ambulance }}</p>
        <p>Fire: {{ emergencyContacts.fire }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { getWeather, getEmergencyContacts } from '~/services/api';
  
  const selectedLocation = ref('');
  const weather = ref(null);
  const emergencyContacts = ref(null);
  
  const fetchData = async () => {
    if (selectedLocation.value) {
      const coords = getCoordinates(selectedLocation.value);
      weather.value = await getWeather(coords.lat, coords.lon);
      emergencyContacts.value = getEmergencyContacts(selectedLocation.value);
    }
  };
  
  const getCoordinates = (location) => {
    const coordinates = {
      "New York": { lat: 40.7128, lon: -74.0060 },
      "London": { lat: 51.5074, lon: -0.1278 },
      "Tokyo": { lat: 35.6895, lon: 139.6917 },
      // Add more locations as needed
    };
  
    return coordinates[location];
  };
  </script>
  