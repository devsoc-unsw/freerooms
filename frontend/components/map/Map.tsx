"use client";

import { DarkModeContext } from "@frontend/app/clientLayout";
import BuildingDrawer from "@frontend/components/map/BuildingDrawer";
import DirectionsSummary from "@frontend/components/map/DirectionSummary";
import MapMarker from "@frontend/components/map/MapMarker";
import { navHeight } from "@frontend/components/navigation/NavBar";
import {
  MAPBOX_ACCESS_TOKEN,
  MAPBOX_STYLE_DARK,
  MAPBOX_STYLE_LIGHT,
} from "@frontend/config";
import useBuilding from "@frontend/hooks/buildings/useBuilding";
import useBuildings from "@frontend/hooks/buildings/useBuildings";
import useMapboxRoute from "@frontend/hooks/map/useMapboxRoute";
import useUserLocation from "@frontend/hooks/map/useUserLocation";
import { useDispatch, useSelector } from "@frontend/redux/hooks";
import {
  selectCurrentBuilding,
  setCurrentBuilding,
} from "@frontend/redux/slices/currentBuildingSlice";
import { shouldCancelRoute } from "@frontend/utils/routeSelection";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Building } from "common/types";
import type { LngLatBoundsLike } from "mapbox-gl";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import type { MapRef } from "react-map-gl/mapbox";
import MapboxMap, { Layer, Marker, Source } from "react-map-gl/mapbox";
import { useDebounceValue } from "usehooks-ts";
import useWalkingMatrix from "@frontend/hooks/map/useWalkingMatrix";

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
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: 18,
        height: 18,
        borderRadius: "50%",
        border: `4px solid ${theme.colours.map.location.border}`,
        backgroundColor: theme.colours.map.location.main,
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
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Use debounce to allow moving from marker to popup without popup hiding
  const [currentHover, setCurrentHover] = useState<Building | null>(null);
  const [debouncedCurrentHover] = useDebounceValue(currentHover, 50);

  const styleArray = isDarkMode ? MAPBOX_STYLE_DARK : MAPBOX_STYLE_LIGHT;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  // Mobile only centres on a building once, for a link that opened the map
  const hasFlownOnLoadRef = useRef(false);
  // Set when collapsing the mobile sheet requests a route, so the map stays put
  const skipNextRouteZoomRef = useRef(false);

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

  { /* Old Method */ }
  // const distances = useMemo(() => {
  //   if (
  //     buildings &&
  //     userLat !== undefined &&
  //     userLng !== undefined &&
  //     isInBounds(userLat, userLng)
  //   ) {
  //     return buildings.map((building) =>
  //       calculateDistance(userLat, userLng, building.lat, building.long)
  //     );
  //   }
  //   return [];
  // }, [buildings, userLat, userLng]);
  
  { /* New Method */ }
  const { distances, durations } = useWalkingMatrix(userLat, userLng, buildings, true)

  // Walking info for the building open in the drawer; prefer the loaded route's numbers
  const selectedBuilding = useSelector(selectCurrentBuilding);
  const selectedIndex =
    buildings?.findIndex((building) => building.id === selectedBuilding?.id) ??
    -1;
  const selectedRoute =
    routeSummary?.destinationBuildingId === selectedBuilding?.id
      ? routeSummary
      : null;
  const selectedDistance = selectedRoute
    ? selectedRoute.distanceMeters
    : distances[selectedIndex];
  const selectedDuration = selectedRoute
    ? selectedRoute.durationSeconds
    : durations[selectedIndex];
  //set current building to search param query - THIS IS WHERE OTHER QUERIES CAN GO
  const searchParams = useSearchParams();
  const buildingId = searchParams.get("building");
  const { building } = useBuilding(buildingId || "");

  useEffect(() => {
    if (building) {
      dispatch(setCurrentBuilding(building));

      if (isMapLoaded) {
        // On mobile, tapping a marker shouldn't move the map
        if (!isMobile || !hasFlownOnLoadRef.current) {
          mapRef.current?.flyTo({
            center: [building.long, building.lat],
            duration: 800,
          });
        }
        hasFlownOnLoadRef.current = true;
      }
    }
  }, [building, dispatch, isMapLoaded, isMobile]);

  useEffect(() => {
    if (!route || route.geometry.coordinates.length === 0) {
      return;
    }

    if (skipNextRouteZoomRef.current) {
      skipNextRouteZoomRef.current = false;
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
    destinationBuilding: Building,
    { keepDrawerOpen = false } = {}
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

    if (!routeWasCreated || keepDrawerOpen) {
      return;
    }

    dispatch(setCurrentBuilding(null));
    router.replace("/map");
  };

  // Collapsing the mobile sheet shows the route, unless it's already shown or loading
  const handleDrawerCollapse = (destinationBuilding: Building) => {
    if (
      routeSummary?.destinationBuildingId === destinationBuilding.id ||
      isRouteLoading
    ) {
      return;
    }

    skipNextRouteZoomRef.current = isMobile;
    void handleGetDirections(destinationBuilding, { keepDrawerOpen: true });
  };

  // Picking a different building cancels the current (or still loading) route
  const handleMarkerSelect = (selected: Building) => {
    if (
      shouldCancelRoute({
        routeDestinationId: routeSummary?.destinationBuildingId,
        isRouteLoading,
        selectedBuildingId: selected.id,
      })
    ) {
      clearRoute();
    }
  };

  // Closing the drawer removes the route to that building
  const handleDrawerClose = (closedBuilding: Building) => {
    if (routeSummary?.destinationBuildingId === closedBuilding.id) {
      clearRoute();
    }
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
          onLoad={() => setIsMapLoaded(true)}
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
                  // The route's own numbers once it has loaded for this building
                  distance={
                    routeSummary?.destinationBuildingId === building.id
                      ? routeSummary.distanceMeters
                      : distances[index]
                  }
                  duration={
                    routeSummary?.destinationBuildingId === building.id
                      ? routeSummary.durationSeconds
                      : durations[index]
                  }
                  isWalkingExact={
                    routeSummary?.destinationBuildingId === building.id
                  }
                  currentHover={debouncedCurrentHover}
                  setCurrentHover={setCurrentHover}
                  isRouteDestination={
                    routeSummary?.destinationBuildingId === building.id
                  }
                  onSelect={handleMarkerSelect}
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
                  "line-color": theme.colours.map.route,
                  "line-width": 6,
                  "line-opacity": 1,
                }}
              />
            </Source>
          )}
        </MapboxMap>

        {/* Hidden while the drawer shows the same building, its peek row has the numbers */}
        {routeSummary &&
          routeSummary.destinationBuildingId !== selectedBuilding?.id && (
            <DirectionsSummary summary={routeSummary} onClose={clearRoute} />
          )}

        <BuildingDrawer
          onGetDirections={handleGetDirections}
          isDirectionsLoading={isLocating || isRouteLoading}
          distance={selectedDistance}
          duration={selectedDuration}
          isWalkingExact={selectedRoute !== null}
          onCollapse={handleDrawerCollapse}
          onClose={handleDrawerClose}
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
