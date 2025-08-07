"use client";
import "mapbox-gl/dist/mapbox-gl.css";

import { Building } from "@common/types";
import Box from "@mui/material/Box";
import { DarkModeContext } from "app/clientLayout";
import React, { useContext, useEffect, useRef, useState } from "react";
import { LngLatBoundsLike, Map, MapRef, Marker } from "react-map-gl/mapbox";
import { useDebounceValue } from "usehooks-ts";

import { MAPBOX_ACCESS_TOKEN } from "../config";
import useBuildings from "../hooks/useBuildings";
import useUserLocation from "../hooks/useUserLocation";
import calculateDistance from "../utils/calculateDistance";
import getMapType from "../utils/getMapType"; // delete this file?
import MapMarker from "./MapMarker";
import RoomMapMarker from "./RoomMapMarker";

const initialViewState = {
  longitude: 151.23129,
  latitude: -33.91767,
  zoom: 17.5,
};

const mapBounds = {
  north: -33.915318,
  south: -33.9202,
  west: 151.225258,
  east: 151.237736,
};

const bounds: LngLatBoundsLike = [
  [mapBounds.west, mapBounds.south],
  [mapBounds.east, mapBounds.north],
];

const isInBounds = (lat: number, lng: number) =>
  lat >= mapBounds.south &&
  lat <= mapBounds.north &&
  lng >= mapBounds.west &&
  lng <= mapBounds.east;

const LocationMarker = () => (
  <Box
    sx={{
      width: 18,
      height: 18,
      borderRadius: "50%",
      border: "4px solid #BEDCF9",
      backgroundColor: "#4ABDFA",
    }}
  />
);

if (!MAPBOX_ACCESS_TOKEN) {
  throw new Error("Missing Mapbox access token");
}

export const MapComponent = () => {
  const { buildings } = useBuildings();
  const { isDarkMode } = useContext(DarkModeContext);
  const { userLat, userLng } = useUserLocation();

  const [roomIdToFocus, setRoomIdToFocus] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    // Run only on client side, no Suspense issues
    const params = new URLSearchParams(window.location.search);
    setRoomIdToFocus(params.get("roomId") ?? undefined);
  }, []);

  const mapRef = useRef<MapRef>(null);

  // Use debounce to allow moving from marker to popup without popup hiding
  const [currentHover, setCurrentHover] = useState<Building | null>(null);
  const [debouncedCurrentHover] = useDebounceValue(currentHover, 50);

  const style = isDarkMode
    ? "mapbox://styles/bengodw/cmcimql2101qo01sp7dricgzq"
    : "mapbox://styles/bengodw/cmcimp1tz002p01rcfzbd8btn";

  const [distances, setDistances] = useState<number[]>([]);

  useEffect(() => {
    if (buildings && userLat && userLng && isInBounds(userLat, userLng)) {
      setDistances(
        buildings.map((building) =>
          calculateDistance(userLat, userLng, building.lat, building.long)
        )
      );
    }
  }, [buildings, userLat, userLng]);

  return (
    <div style={{ height: "100%", position: "relative" }}>
      <Map
        ref={mapRef}
        initialViewState={initialViewState}
        mapStyle={style}
        mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
        maxBounds={bounds}
        style={{ width: "100%", height: "100%" }}
      >
        {buildings?.map((building, index) => (
          <Marker
            key={building.id}
            latitude={building.lat}
            longitude={building.long}
          >
            <MapMarker
              buildingId={building.id}
              distance={distances[index]}
              currentHover={debouncedCurrentHover}
              setCurrentHover={setCurrentHover}
            />
          </Marker>
        ))}

        {userLat && userLng && isInBounds(userLat, userLng) && (
          <Marker latitude={userLat} longitude={userLng} anchor="center">
            <LocationMarker />
          </Marker>
        )}

        {roomIdToFocus && (
          <RoomMapMarker
            roomId={roomIdToFocus}
            roomLocation={(lat, long) => {
              mapRef.current?.flyTo({
                center: [long, lat],
                zoom: 19.5,
                duration: 1000,
              });
            }}
          />
        )}
      </Map>
    </div>
  );
};
