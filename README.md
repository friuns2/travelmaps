https://github.com/friuns2/travelmaps/assets/16543239/3fc07810-ec7a-4c82-93c5-e9d5e8550002


# Travel Creator

Travel Creator is a web application that helps users discover and plan their travel itineraries. Built with Nuxt 3 and utilizing the Google Maps API, this app allows users to explore attractions, create custom itineraries, and visualize their travel plans on an interactive map.

Try it: https://maps.gptcall.net/
Created with [GPTCall App Creator](https://app.gptcall.net/)

## Features

- Discover tourist attractions based on a selected location
- Filter attractions by minimum rating count
- Sort attractions by relevance, popularity, or distance
- Add/remove attractions to/from your itinerary
- View attractions on an interactive map
- Calculate and display directions for your itinerary
- Responsive design for both desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- Google Maps API key

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/travel-creator.git
   cd travel-creator
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add your Google Maps API key:
   ```
   GOOGLE_MAPS_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3005` to see the app in action.

## Usage

1. Click on the title to change the location.
2. Use the slider to filter attractions by minimum rating count.
3. Click on attractions to view them on the map.
4. Add attractions to your itinerary using the "Add to Itinerary" button.
5. Toggle between list and map views on mobile devices.
6. Use the "Show Itinerary" button to view your planned route.

## Component Structure and Usage

The application's logic has been refactored to split into multiple Vue components for better maintainability and scalability. Here's an overview of the new components and how they are used:

- `AttractionList.vue`: This component is responsible for rendering the list of attractions. It receives the list of attractions as a prop and handles user interactions such as focusing on an attraction or toggling it in the itinerary.

- `MapView.vue`: This component handles the display of the interactive map. It receives the home location and the list of attractions as props, and it is responsible for initializing the map, creating markers, and displaying directions.

- `Filters.vue`: This component provides the UI for filtering attractions based on the minimum rating count. It receives the minimum rating count as a prop and emits an event when the value changes.

These components are imported and used in the `pages/index.vue` file, which acts as the main entry point for the application's UI.

## Future Plans

- Implement AI support to generate travel recommendations and itineraries based on user preferences and travel style.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
