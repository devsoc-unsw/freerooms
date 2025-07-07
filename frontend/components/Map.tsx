"use client";
import "mapbox-gl/dist/mapbox-gl.css";

import { Building } from "@common/types";
import mbxDirections from "@mapbox/mapbox-sdk/services/directions";
import Box from "@mui/material/Box";
import { DarkModeContext } from "app/clientLayout";
import { useSearchParams } from "next/navigation";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Layer,
  LngLatBoundsLike,
  Map,
  MapRef,
  Marker,
  Source,
} from "react-map-gl/mapbox";
import { useDebounceValue } from "usehooks-ts";
import BuildingDrawer from "views/BuildingDrawer";

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

const directionsClient = mbxDirections({ accessToken: MAPBOX_ACCESS_TOKEN });

const fetchRoute = async (start: [number, number], end: [number, number]) => {
  try {
    const response = await directionsClient
      .getDirections({
        profile: "walking", // or 'driving', 'cycling'
        geometries: "geojson",
        waypoints: [{ coordinates: start }, { coordinates: end }],
      })
      .send();

    return response.body.routes[0].geometry;
  } catch (error: any) {
    console.error("Route fetch error:", error.response?.body || error.message);
    throw error;
  }
};

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

  // useEffect(() => {
  //   // Run only on client side, no Suspense issues
  //   const params = new URLSearchParams(window.location.search);
  //   setRoomIdToFocus(params.get("roomId") ?? undefined);
  // }, []);
  // const roomIdToFocus = useSearchParams().get("roomId") ?? undefined;
  const mapRef = useRef<MapRef>(null);

  // Use debounce to allow moving from marker to popup without popup hiding
  const [currentHover, setCurrentHover] = useState<Building | null>(null);
  const [debouncedCurrentHover] = useDebounceValue(currentHover, 50);

  const [routeGeoJSON, setRouteGeoJSON] = useState<any | null>(null);

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

  const handleMarkerClick = async (building: Building) => {
    if (!userLat || !userLng) return;

    const geometry = await fetchRoute(
      [userLng, userLat],
      [building.long, building.lat]
    );

    setRouteGeoJSON({
      type: "Feature",
      properties: {},
      geometry,
    });
  };

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
            onClick={() => handleMarkerClick(building)}
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

        {routeGeoJSON && (
          <>
            <Source id="route" type="geojson" data={routeGeoJSON} />
            <Layer
              id="route-line"
              type="line"
              source="route"
              layout={{
                "line-cap": "round",
                "line-join": "round",
              }}
              paint={{
                "line-color": "#1DB954",
                "line-width": 4,
              }}
            />
          </>
        )}
      </Map>
    </div>
  );
};
