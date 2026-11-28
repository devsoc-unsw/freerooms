import calculateDistance from "@frontend/utils/calculateDistance";

// Centre of campus
export const CAMPUS_CENTRE = { lat: -33.91767, lng: 151.23129 };

// 800m buffer for a user's location from the centre of campus
export const CAMPUS_RADIUS_METRES = 800;

// Whether a location is close enough to campus to be worth a Mapbox request
export const isOnCampus = (lat?: number, lng?: number): boolean =>
  lat !== undefined &&
  lng !== undefined &&
  Number.isFinite(lat) &&
  Number.isFinite(lng) &&
  calculateDistance(lat, lng, CAMPUS_CENTRE.lat, CAMPUS_CENTRE.lng) <=
    CAMPUS_RADIUS_METRES;
