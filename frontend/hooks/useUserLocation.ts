import { useEffect, useState } from "react";

/**
 * Get the user's current location using Geolocation API
 */
const useUserLocation = () => {
  const [userLat, setUserLat] = useState<number>();
  const [userLng, setUserLng] = useState<number>();

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLat(pos.lat);
          setUserLng(pos.lng);
        },
        (error: GeolocationPositionError) => {
          console.error("Geolocation error:", error);
          switch (error.code) {
            case error.PERMISSION_DENIED:
              console.warn("User denied the request for Geolocation.");
              break;
            case error.POSITION_UNAVAILABLE:
              console.warn("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              console.warn("The request to get user location timed out.");
              break;
            default:
              console.warn("An unknown error occurred.");
              break;
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      console.warn("Geolocation is not supported by this browser.");
    }
  }, []);

  return { userLat, userLng };
};

export default useUserLocation;
