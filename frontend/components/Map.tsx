"use client";

import { Building } from "@common/types";
import useBuilding from "@frontend/hooks/useBuilding";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import { DarkModeContext } from "app/clientLayout";
import type { LngLatBoundsLike } from "mapbox-gl";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import type { MapRef } from "react-map-gl/mapbox";
import MapboxMap, { Layer, Marker, Source } from "react-map-gl/mapbox";
import { useDebounceValue } from "usehooks-ts";
import BuildingDrawer from "views/BuildingDrawer";

import {
  MAPBOX_ACCESS_TOKEN,
  MAPBOX_STYLE_DARK,
  MAPBOX_STYLE_LIGHT,
} from "../config";
import useBuildings from "../hooks/useBuildings";
import useMapboxRoute from "../hooks/useMapboxRoute";
import useUserLocation from "../hooks/useUserLocation";
import { setCurrentBuilding } from "../redux/currentBuildingSlice";
import { useDispatch } from "../redux/hooks";
import calculateDistance from "../utils/calculateDistance";
import DirectionsSummary from "./DirectionSummary";
import MapMarker from "./MapMarker";
import { navHeight } from "./NavBar";

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

const bounds: LngLatBoundsLike = [
  [mapBounds.west, mapBounds.south],
  [mapBounds.east, mapBounds.north],
];

const isInBounds = (lat: number, lng: number) =>
  lat >= mapBounds.south &&
  lat <= mapBounds.north &&
  lng >= mapBounds.west &&
  lng <= mapBounds.east;

const LocationMarker = () => {
  return (
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
};

export const Map = () => {
  // Fetch data
  const { buildings } = useBuildings();
  const { isDarkMode } = useContext(DarkModeContext);
  const dispatch = useDispatch();
  const router = useRouter();
  const mapRef = useRef<MapRef>(null);

  // Use debounce to allow moving from marker to popup without popup hiding
  const [currentHover, setCurrentHover] = useState<Building | null>(null);
  const [debouncedCurrentHover] = useDebounceValue(currentHover, 50);

  const styleArray = isDarkMode ? MAPBOX_STYLE_DARK : MAPBOX_STYLE_LIGHT;

  // Get current location of user
  const {
    userLat,
    userLng,
    isLocating,
    locationError,
    refreshLocation,
    clearLocationError,
  } = useUserLocation();

  const {
    route,
    routeSummary,
    isRouteLoading,
    routeError,
    calculateRoute,
    clearRoute,
    clearRouteError,
  } = useMapboxRoute();

  const distances = useMemo(() => {
    if (
      buildings &&
      userLat !== undefined &&
      userLng !== undefined &&
      isInBounds(userLat, userLng)
    ) {
      return buildings.map((building) =>
        calculateDistance(userLat, userLng, building.lat, building.long)
      );
    }
    return [];
  }, [buildings, userLat, userLng]);

  //set current building to search param query - THIS IS WHERE OTHER QUERIES CAN GO
  const searchParams = useSearchParams();
  const buildingId = searchParams.get("building");
  const { building } = useBuilding(buildingId || "");

  useEffect(() => {
    if (building) {
      dispatch(setCurrentBuilding(building || null));
    }
  }, [building, dispatch]);

  useEffect(() => {
    if (!route || route.geometry.coordinates.length === 0) {
      return;
    }

    const longitudes = route.geometry.coordinates.map(
      ([longitude]) => longitude
    );
    const latitudes = route.geometry.coordinates.map(
      ([, latitude]) => latitude
    );

    const routeBounds: LngLatBoundsLike = [
      [Math.min(...longitudes), Math.min(...latitudes)],
      [Math.max(...longitudes), Math.max(...latitudes)],
    ];

    mapRef.current?.fitBounds(routeBounds, {
      padding: {
        top: 80,
        bottom: 150,
        left: 60,
        right: 60,
      },
      duration: 900,
      maxZoom: 18.5,
    });
  }, [route]);

  const handleGetDirections = async (
    destinationBuilding: Building
  ): Promise<void> => {
    let origin;

    try {
      origin = await refreshLocation();
    } catch {
      return;
    }

    const routeWasCreated = await calculateRoute({
      origin,
      destinationBuilding,
    });

    if (!routeWasCreated) {
      return;
    }

    dispatch(setCurrentBuilding(null));
    router.replace("/map");
  };

  const displayedError = locationError ?? routeError;

  const closeDisplayedError = () => {
    clearLocationError();
    clearRouteError();
  };

  const renderMap = () => {
    return (
      <div
        style={{
          position: "relative",
          height: `calc(100svh - ${navHeight}px)`,
        }}
      >
        <MapboxMap
          ref={mapRef}
          key={isDarkMode ? "dark-map" : "light-map"}
          initialViewState={{
            latitude: center.lat,
            longitude: center.lng,
            zoom: 17.5,
          }}
          mapStyle={styleArray}
          mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
          maxBounds={route ? undefined : bounds}
          minZoom={14}
          maxZoom={21}
          style={{ width: "100%", height: "100%" }}
        >
          {buildings &&
            buildings.map((building, index) => (
              <Marker
                key={building.id}
                latitude={building.lat}
                longitude={building.long}
                anchor="center"
                style={{
                  zIndex:
                    debouncedCurrentHover?.id === building.id ||
                    routeSummary?.destinationBuildingId === building.id
                      ? 2
                      : 1,
                }}
              >
                <MapMarker
                  buildingId={building.id}
                  distance={distances[index]}
                  currentHover={debouncedCurrentHover}
                  setCurrentHover={setCurrentHover}
                  isRouteDestination={
                    routeSummary?.destinationBuildingId === building.id
                  }
                />
              </Marker>
            ))}

          {userLat !== undefined &&
            userLng !== undefined &&
            (isInBounds(userLat, userLng) || route !== null) && (
              <Marker latitude={userLat} longitude={userLng} anchor="center">
                <LocationMarker />
              </Marker>
            )}

          {route && (
            <Source id="walking-route" type="geojson" data={route}>
              <Layer
                id="walking-route-line"
                type="line"
                layout={{
                  "line-cap": "round",
                  "line-join": "round",
                }}
                paint={{
                  "line-color": "#EF6C02",
                  "line-width": 6,
                  "line-opacity": 1,
                }}
              />
            </Source>
          )}
        </MapboxMap>

        {routeSummary && (
          <DirectionsSummary summary={routeSummary} onClose={clearRoute} />
        )}

        <BuildingDrawer
          onGetDirections={handleGetDirections}
          isDirectionsLoading={isLocating || isRouteLoading}
        />

        <Snackbar
          open={Boolean(displayedError)}
          autoHideDuration={7000}
          onClose={closeDisplayedError}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <Alert
            severity="error"
            variant="filled"
            onClose={closeDisplayedError}
            sx={{ width: "100%" }}
          >
            {displayedError}
          </Alert>
        </Snackbar>
      </div>
    );
  };

  if (!MAPBOX_ACCESS_TOKEN) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Mapbox is not configured. Add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to
        frontend/.env.local.
      </Alert>
    );
  }

  return renderMap();
};
