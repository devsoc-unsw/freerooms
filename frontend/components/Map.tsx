import Box from "@mui/material/Box";
import {
  GoogleMap,
  OverlayView,
  OverlayViewF,
  useJsApiLoader,
} from "@react-google-maps/api";
import React, { useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";

import { GOOGLE_API_KEY } from "../config";
import useBuildings from "../hooks/useBuildings";
import useUserLocation from "../hooks/useUserLocation";
import { Building } from "../types";
import calculateDistance from "../utils/calculateDistance";
import MapMarker from "./MapMarker";

const center = {
  lat: -33.91767,
  lng: 151.23129,
};

const mapBounds = {
  north: -33.915318,
  south: -33.9202,
  west: 151.225258,
  east: 151.237736,
};

const isInBounds = (lat: number, lng: number) =>
  lat >= mapBounds.south && lat <= mapBounds.north &&
  lng >= mapBounds.west && lng <= mapBounds.east;

const LocationMarker = () => {
  return (
    <>
      <Box
        sx={() => ({
          width: 18,
          height: 18,
          borderRadius: "50%",
          border: "4px solid #BEDCF9",
          backgroundColor: "#4ABDFA",
        })}
      />
    </>
  );
};

export const Map = () => {
  // Fetch data
  const { buildings } = useBuildings();

  // Use debounce to allow moving from marker to popup without popup hiding
  const [currentHover, setCurrentHover] = useState<Building | null>(null);
  const debouncedCurrentHover = useDebounce(currentHover, 50);

  const styleArray = [
    {
      featureType: "all",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "landscape",
      stylers: [{ visibility: "on" }],
    },
    {
      featureType: "landscape",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "road",
      stylers: [{ visibility: "on" }],
    },
    {
      featureType: "road",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
  ];

  // Get current location of user
  const { userLat, userLng } = useUserLocation();

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_API_KEY
  });

  const [distances, setDistances] = useState<number[]>([]);

  useEffect(() => {
    if (buildings && userLat && userLng && isInBounds(userLat, userLng)) {
      setDistances(buildings.map((building) =>
        calculateDistance(userLat, userLng, building.lat, building.long)
      ))
    }
  }, [buildings, userLat, userLng]);

  const renderMap = () => {
    return (
      <div style={{ position: "relative", height: "100%" }}>
        <GoogleMap
          mapContainerStyle={{ height: "100%", }}
          center={center}
          options={{
            clickableIcons: false,
            // disableDefaultUI: true,
            fullscreenControl: false,
            mapTypeControl: false,
            restriction: {
              latLngBounds: mapBounds,
              strictBounds: false,
            },
            styles: styleArray,
            // zoomControl: false,
          }}
          zoom={17.5}
        >
          {buildings && buildings.map((building, index) => (
            <OverlayViewF
              key={building.id}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              position={{
                lat: building.lat,
                lng: building.long,
              }}
              zIndex={debouncedCurrentHover?.id === building.id ? 2 : 1}
            >
              <MapMarker
                buildingId={building.id}
                distance={distances[index]}
                currentHover={debouncedCurrentHover}
                setCurrentHover={setCurrentHover}
              />
            </OverlayViewF>
          ))}
          {userLat && userLng && isInBounds(userLat, userLng) && (
            <OverlayViewF
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              position={{
                lat: userLat,
                lng: userLng,
              }}
            >
              <LocationMarker />
            </OverlayViewF>
          )}
        </GoogleMap>
      </div>
    );
  };

  if (loadError) {
    return <div>Map cannot be loaded right now.</div>;
  }

  return isLoaded ? renderMap() : <></>;
};
