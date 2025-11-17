import { useEffect, useState } from "react";

/**
 * Get the user's current location using Geolocation API
 */
const useUserLocation = () => {
  const [userLat, setUserLat] = useState<number>();
  const [userLng, setUserLng] = useState<number>();

  useEffect(() => {
    console.log("TEST USEFFECT");

    if ("geolocation" in navigator) {
      console.log("geolocation");

      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLat(pos.lat);
          setUserLng(pos.lng);
        }
      );
    }
  }, []);

  return { userLat, userLng };
};

export default useUserLocation;
