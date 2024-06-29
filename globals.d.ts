declare global {
  function calculateDirections(): void;
  function updateDistances(): void;
  function calculateDistance(from: google.maps.LatLngLiteral, to: google.maps.LatLngLiteral): number;
  function updateLocation(location: google.maps.LatLngLiteral, placeName?: string): void;
  function placeHomeMarker(): void;
  function clearMarkers(): void;
}

export {};
