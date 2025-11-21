"use client";
import "mapbox-gl/dist/mapbox-gl.css";

import { Building } from "@common/types";
import Box from "@mui/material/Box";
import { DarkModeContext } from "app/clientLayout";
import useMapboxNavigation from "hooks/useMapboxNavigation";
import useRoom from "hooks/useRoom";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
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

import {
  MAPBOX_ACCESS_TOKEN,
  MAPBOX_STYLE_DARK,
  MAPBOX_STYLE_LIGHT,
} from "../config";
import useBuildings from "../hooks/useBuildings";
import useUserLocation from "../hooks/useUserLocation";
import calculateDistance from "../utils/calculateDistance";
import GetDirectionsBox from "./GetDirectionsBox";
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
  // Use debounce to allow moving from marker to popup without popup hiding
  const [currentHover, setCurrentHover] = useState<Building | null>(null);
  const [debouncedCurrentHover] = useDebounceValue(currentHover, 50);
  const [routeGeoJSON, setRouteGeoJSON] = useState<any | null>(null);
  const [distances, setDistances] = useState<number[]>([]);
  const [roomIdToFocus, setRoomIdToFocus] = useState<string>("");
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);

  const mapRef = useRef<MapRef>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { buildings } = useBuildings();
  const { isDarkMode } = useContext(DarkModeContext);
  const { userLat, userLng } = useUserLocation();
  const { room } = useRoom(roomIdToFocus);

  // debound map loaded when style changes for light/dark mode
  const debouncedSetMapLoaded = useCallback(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // set a new timeout to set isMapLoaded to true after 300ms of no style changes
    debounceTimeoutRef.current = setTimeout(() => {
      setIsMapLoaded(true);
      debounceTimeoutRef.current = null;
    }, 300);
  }, []);

  const { geometry } = useMapboxNavigation(userLat, userLng, room);

  useEffect(() => {
    // Run only on client side, no Suspense issues
    const params = new URLSearchParams(window.location.search);
    setRoomIdToFocus(params.get("roomId") ?? "");
  }, []);

  const style = isDarkMode ? MAPBOX_STYLE_DARK : MAPBOX_STYLE_LIGHT;

  // reset map loaded state when style changes (light/dark mode)
  useEffect(() => {
    // clear any pending debounce timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = null;
    }
    setIsMapLoaded(false);
  }, [style]);

  // clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

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
    <div style={{ height: "100vh", position: "relative" }}>
      <Map
        ref={mapRef}
        initialViewState={initialViewState}
        mapStyle={style}
        mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
        maxBounds={bounds}
        onLoad={() => {
          debouncedSetMapLoaded();
        }}
        onStyleData={() => {
          debouncedSetMapLoaded();
        }}
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

        {routeGeoJSON && isMapLoaded && (
          <>
            <Source
              key={`route-source-${style}`}
              id="route"
              type="geojson"
              data={routeGeoJSON}
            />
            <Layer
              key={`route-layer-${style}`}
              id="route-line"
              type="line"
              source="route"
              layout={{
                "line-cap": "round",
                "line-join": "round",
              }}
              paint={{
                "line-color": isDarkMode ? "#4ABDFA" : "#2196F3",
                "line-width": 4,
                "line-opacity": 1,
              }}
            />
          </>
        )}
      </Map>
      {room && (
        <>
          <GetDirectionsBox
            userLat={userLat}
            userLng={userLng}
            setRouteGeoJSON={setRouteGeoJSON}
            geometry={geometry}
            room={room}
          />
        </>
      )}
      <BuildingDrawer />
    </div>
  );
};
