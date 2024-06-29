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
        "Paris": { police: "17", ambulance: "15", fire: "18" },
        "Tokyo": { police: "110", ambulance: "119", fire: "119" },
        "Sydney": { police: "000", ambulance: "000", fire: "000" },
        "Rome": { police: "112", ambulance: "118", fire: "115" },
        "Dubai": { police: "999", ambulance: "998", fire: "997" },
        "Singapore": { police: "999", ambulance: "995", fire: "995" },
        "Hong Kong": { police: "999", ambulance: "999", fire: "999" },
        "Bangkok": { police: "191", ambulance: "1669", fire: "199" },
        "Barcelona": { police: "112", ambulance: "112", fire: "112" },
        "Istanbul": { police: "155", ambulance: "112", fire: "110" },
        "Cairo": { police: "122", ambulance: "123", fire: "180" },
        "Moscow": { police: "102", ambulance: "103", fire: "101" },
        "Rio de Janeiro": { police: "190", ambulance: "192", fire: "193" },
        "Cape Town": { police: "10111", ambulance: "10177", fire: "10177" },
        "Delhi": { police: "100", ambulance: "102", fire: "101" },
        "Mumbai": { police: "100", ambulance: "102", fire: "101" },
        "Kuala Lumpur": { police: "999", ambulance: "999", fire: "994" },
        "Amsterdam": { police: "112", ambulance: "112", fire: "112" },
        "Toronto": { police: "911", ambulance: "911", fire: "911" },
        "Los Angeles": { police: "911", ambulance: "911", fire: "911" },
        "Las Vegas": { police: "911", ambulance: "911", fire: "911" },
        "San Francisco": { police: "911", ambulance: "911", fire: "911" },
        "Miami": { police: "911", ambulance: "911", fire: "911" },
        "Orlando": { police: "911", ambulance: "911", fire: "911" },
        "Chicago": { police: "911", ambulance: "911", fire: "911" },
        "Seattle": { police: "911", ambulance: "911", fire: "911" },
        "Bali": { police: "110", ambulance: "118", fire: "113" },
        "Hawaii": { police: "911", ambulance: "911", fire: "911" },
        "Cuba": { police: "106", ambulance: "104", fire: "105" },
        "Andaman and Nicobar": { police: "100", ambulance: "102", fire: "101" },
        "Chennai": { police: "100", ambulance: "108", fire: "101" },
        "Athens": { police: "100", ambulance: "166", fire: "199" },
        "Bangkok": { police: "191", ambulance: "1669", fire: "199" },
        "Phuket": { police: "191", ambulance: "1669", fire: "199" },
        "Venice": { police: "112", ambulance: "118", fire: "115" },
        "Florence": { police: "112", ambulance: "118", fire: "115" },
        "Milan": { police: "112", ambulance: "118", fire: "115" },
        "Vienna": { police: "133", ambulance: "144", fire: "122" },
        "Salzburg": { police: "133", ambulance: "144", fire: "122" },
        "Prague": { police: "158", ambulance: "155", fire: "150" },
        "Budapest": { police: "107", ambulance: "104", fire: "105" },
        "Warsaw": { police: "112", ambulance: "999", fire: "998" },
        "Krakow": { police: "112", ambulance: "999", fire: "998" },
        "Lisbon": { police: "112", ambulance: "112", fire: "112" },
        "Porto": { police: "112", ambulance: "112", fire: "112" },
        "Madrid": { police: "112", ambulance: "112", fire: "112" },
        "Seville": { police: "112", ambulance: "112", fire: "112" },
        "Valencia": { police: "112", ambulance: "112", fire: "112" },
        "Reykjavik": { police: "112", ambulance: "112", fire: "112" },
        "Dublin": { police: "112", ambulance: "112", fire: "112" },
        "Edinburgh": { police: "999", ambulance: "999", fire: "999" },
        "Glasgow": { police: "999", ambulance: "999", fire: "999" },
        "Munich": { police: "110", ambulance: "112", fire: "112" },
        "Berlin": { police: "110", ambulance: "112", fire: "112" },
        "Hamburg": { police: "110", ambulance: "112", fire: "112" },
        "Zurich": { police: "117", ambulance: "144", fire: "118" },
        "Geneva": { police: "117", ambulance: "144", fire: "118" },
        "Interlaken": { police: "117", ambulance: "144", fire: "118" },
        "Vienna": { police: "133", ambulance: "144", fire: "122" },
        "Brussels": { police: "112", ambulance: "112", fire: "112" },
        "Bruges": { police: "112", ambulance: "112", fire: "112" },
        "Mexico City": { police: "911", ambulance: "065", fire: "068" },
        "Cancun": { police: "911", ambulance: "065", fire: "068" },
        "Tulum": { police: "911", ambulance: "065", fire: "068" },
        "Lima": { police: "105", ambulance: "106", fire: "116" },
        "Cusco": { police: "105", ambulance: "106", fire: "116" },
        "Buenos Aires": { police: "101", ambulance: "107", fire: "100" },
        "Santiago": { police: "133", ambulance: "131", fire: "132" },
        "Bogota": { police: "123", ambulance: "125", fire: "119" },
        "Cartagena": { police: "123", ambulance: "125", fire: "119" },
        "San Jose": { police: "911", ambulance: "128", fire: "118" },
        "Panama City": { police: "104", ambulance: "911", fire: "103" },
        "Kingston": { police: "119", ambulance: "110", fire: "110" },
        "Montego Bay": { police: "119", ambulance: "110", fire: "110" },
        "Havana": { police: "106", ambulance: "104", fire: "105" },
        // Add more tourist locations as needed
    };

    return emergencyContacts[location] || { police: "Unknown", ambulance: "Unknown", fire: "Unknown" };
};

// Example usage:
const contacts = getEmergencyContacts("Paris");
console.log(contacts); // { police: "17", ambulance: "15", fire: "18" }
