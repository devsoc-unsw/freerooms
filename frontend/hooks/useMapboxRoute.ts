import { Building } from "@common/types";
import { useCallback, useEffect, useRef, useState } from "react";

import { MAPBOX_ACCESS_TOKEN } from "../config";
import { UserLocation } from "./useUserLocation";

export type RouteGeometry = {
  type: "LineString";
  coordinates: [number, number][];
};

export type RouteFeature = {
  type: "Feature";
  properties: Record<string, never>;
  geometry: RouteGeometry;
};

export type RouteSummary = {
  destinationBuildingId: string;
  destinationName: string;
  distanceMeters: number;
  durationSeconds: number;
};

type CalculateRouteArguments = {
  origin: UserLocation;
  destinationBuilding: Building;
};

type MapboxRoute = {
  distance: number;
  duration: number;
  geometry: RouteGeometry;
};

type MapboxDirectionsResponse = {
  code?: string;
  message?: string;
  routes?: MapboxRoute[];
};

const DEFAULT_ROUTE_ERROR =
  "Walking directions could not be calculated. Please try again.";

// Checks if mapbox returns a valid route
const isValidMapboxRoute = (
  route: MapboxRoute | undefined
): route is MapboxRoute => {
  if (!route) {
    return false;
  }

  return (
    Number.isFinite(route.distance) &&
    Number.isFinite(route.duration) &&
    route.geometry?.type === "LineString" &&
    Array.isArray(route.geometry.coordinates) &&
    route.geometry.coordinates.length >= 2
  );
};

// gets and stores the route
const useMapboxRoute = () => {
  const [route, setRoute] = useState<RouteFeature | null>(null);
  const [routeSummary, setRouteSummary] = useState<RouteSummary | null>(null);
  const [isRouteLoading, setIsRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);

  // Cancels when user quickly changes destination
  const requestControllerRef = useRef<AbortController | null>(null);

  // Only newest can update state
  const requestNumberRef = useRef(0);

  // Clear displayed error
  const clearRouteError = useCallback(() => {
    setRouteError(null);
  }, []);


  // Remove and cancel current route
  const clearRoute = useCallback(() => {
    requestNumberRef.current += 1;

    requestControllerRef.current?.abort();
    requestControllerRef.current = null;

    setRoute(null);
    setRouteSummary(null);
    setRouteError(null);
    setIsRouteLoading(false);
  }, []);


  // Request a walking route, returns if valid route
  const calculateRoute = useCallback(
    async ({
      origin,
      destinationBuilding,
    }: CalculateRouteArguments): Promise<boolean> => {
      if (!MAPBOX_ACCESS_TOKEN) {
        setRouteError(
          "Mapbox is not configured. Add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to frontend/.env.local."
        );

        return false;
      }

      const destinationLatitude = destinationBuilding.lat;
      const destinationLongitude = destinationBuilding.long;

      if (
        !Number.isFinite(origin.lat) ||
        !Number.isFinite(origin.lng) ||
        !Number.isFinite(destinationLatitude) ||
        !Number.isFinite(destinationLongitude)
      ) {
        setRouteError(
          "Directions could not be calculated because one or more coordinates are invalid."
        );

        return false;
      }


      // Cancel current request
      requestControllerRef.current?.abort();

      const controller = new AbortController();
      requestControllerRef.current = controller;

      const requestNumber = ++requestNumberRef.current;

      setIsRouteLoading(true);
      setRouteError(null);


      // Long, Lat order
      const coordinates = [
        `${origin.lng},${origin.lat}`,
        `${destinationLongitude},${destinationLatitude}`,
      ].join(";");

      const url = new URL(
        `https://api.mapbox.com/directions/v5/mapbox/walking/${coordinates}`
      );

      url.searchParams.set("access_token", MAPBOX_ACCESS_TOKEN);
      url.searchParams.set("geometries", "geojson");
      url.searchParams.set("overview", "full");
      url.searchParams.set("steps", "false");

      try {
        const response = await fetch(url.toString(), {
          method: "GET",
          signal: controller.signal,
        });

        const responseBody =
          (await response.json()) as MapboxDirectionsResponse;


        // Ignore request if not the newest
        if (requestNumber !== requestNumberRef.current) {
          return false;
        }

        if (!response.ok) {
          throw new Error(responseBody.message || DEFAULT_ROUTE_ERROR);
        }

        if (responseBody.code !== "Ok") {
          throw new Error(responseBody.message || DEFAULT_ROUTE_ERROR);
        }

        const firstRoute = responseBody.routes?.[0];

        if (!isValidMapboxRoute(firstRoute)) {
          throw new Error("Mapbox did not return a usable walking route.");
        }

        const routeFeature: RouteFeature = {
          type: "Feature",
          properties: {},
          geometry: firstRoute.geometry,
        };

        setRoute(routeFeature);

        setRouteSummary({
          destinationBuildingId: destinationBuilding.id,
          destinationName: destinationBuilding.name,
          distanceMeters: firstRoute.distance,
          durationSeconds: firstRoute.duration,
        });

        return true;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return false;
        }

        if (requestNumber !== requestNumberRef.current) {
          return false;
        }

        const message =
          error instanceof Error ? error.message : DEFAULT_ROUTE_ERROR;

        setRouteError(message);
        setRoute(null);
        setRouteSummary(null);

        return false;
      } finally {
        // only newest can update the state
        if (requestNumber === requestNumberRef.current) {
          setIsRouteLoading(false);
          requestControllerRef.current = null;
        }
      }
    },
    []
  );


  // Cancels any outgoing request
  useEffect(() => {
    return () => {
      requestControllerRef.current?.abort();
    };
  }, []);

  return {
    route,
    routeSummary,
    isRouteLoading,
    routeError,
    calculateRoute,
    clearRoute,
    clearRouteError,
  };
};

export default useMapboxRoute;
