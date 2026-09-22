import { useCallback, useEffect, useState } from "react";

export type UserLocation = {
  lat: number;
  lng: number;
};

const GEOLOCATION_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 30000,
};

// Converts a browser Geolocation API error into a readable message
const getLocationErrorMessage = (error: GeolocationPositionError): string => {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return "Location permission was denied. Enable location access in your browser settings.";

    case error.POSITION_UNAVAILABLE:
      return "Your current location could not be determined.";

    case error.TIMEOUT:
      return "Getting your current location took too long. Please try again.";

    default:
      return "An unexpected error occurred while getting your location.";
  }
};

const getCurrentUserLocation = (): Promise<UserLocation> => {
  if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
    return Promise.reject(
      new Error("Geolocation is not supported by your browser.")
    );
  }

  return new Promise<UserLocation>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error: GeolocationPositionError) => {
        reject(new Error(getLocationErrorMessage(error)));
      },
      GEOLOCATION_OPTIONS
    );
  });
};

const useUserLocation = () => {
  const [location, setLocation] = useState<UserLocation | null>(null);

  const [isLocating, setIsLocating] = useState(true);

  const [locationError, setLocationError] = useState<string | null>(null);

  // Update the current location with new info
  const refreshLocation = useCallback(async (): Promise<UserLocation> => {
    setIsLocating(true);
    setLocationError(null);

    try {
      const newLocation = await getCurrentUserLocation();

      setLocation(newLocation);

      return newLocation;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while getting your location.";

      setLocationError(message);

      throw error instanceof Error ? error : new Error(message);
    } finally {
      setIsLocating(false);
    }
  }, []);

  // Clears displayed location
  const clearLocationError = useCallback(() => {
    setLocationError(null);
  }, []);

  //Gets the user's location once when the hook is first mounted.
  useEffect(() => {
    let isMounted = true;

    void getCurrentUserLocation()
      .then((initialLocation) => {
        if (!isMounted) {
          return;
        }

        setLocation(initialLocation);
        setLocationError(null);
        setIsLocating(false);
      })
      .catch((error: unknown) => {
        if (!isMounted) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred while getting your location.";

        setLocationError(message);
        setIsLocating(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    location,
    userLat: location?.lat,
    userLng: location?.lng,
    isLocating,
    locationError,
    refreshLocation,
    clearLocationError,
  };
};

export default useUserLocation;
