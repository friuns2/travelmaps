import axios from 'axios';
import { useRuntimeConfig } from '#imports';

const config = useRuntimeConfig();

export const getWeather = async(latitude, longitude) => {
    try {
        const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
            params: {
                lat: latitude,
                lon: longitude,
                appid: config.public.openWeatherMapApiKey,
                units: 'metric'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
};

export const getEmergencyContacts = (location) => {
    const emergencyContacts = {
        "New York": { police: "911", ambulance: "911", fire: "911" },
        "London": { police: "999", ambulance: "999", fire: "999" },
        "Tokyo": { police: "110", ambulance: "119", fire: "119" },
        // Add more locations as needed
    };

    return emergencyContacts[location] || { police: "N/A", ambulance: "N/A", fire: "N/A" };
};