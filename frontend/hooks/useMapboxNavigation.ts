import { useEffect, useState } from "react";
import mbxDirections from "@mapbox/mapbox-sdk/services/directions";
import { MAPBOX_ACCESS_TOKEN } from "../config";
import { Building } from "@common/types";

const fetchRoute = async (start: [number, number], end: [number, number]) => {
  if (!MAPBOX_ACCESS_TOKEN) {
    throw new Error("Missing Mapbox access token");
  }

  const directionsClient = mbxDirections({ accessToken: MAPBOX_ACCESS_TOKEN });

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

const useMapboxNavigation = async (
  userLat: number,
  userLng: number,
  building: Building
) => {
  const geometry = await fetchRoute(
    [userLng, userLat],
    [building.long, building.lat]
  );

  return geometry;
};

export default useMapboxNavigation;
