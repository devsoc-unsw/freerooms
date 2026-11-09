import { MAPBOX_ACCESS_TOKEN } from "@frontend/config";

/**
 * Calculate distance to the neatest metre between two points using Haversine formula
 * From https://stackoverflow.com/a/21623206
 */
type MapboxDirectionsResponse = {
  code?: string;
  message?: string;
  routes?: MapboxRoute[];
};

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

export default function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const pi = 0.017453292519943295; // Math.PI / 180
  const cos = Math.cos;
  const a =
    0.5 -
    cos((lat2 - lat1) * pi) / 2 +
    (cos(lat1 * pi) * cos(lat2 * pi) * (1 - cos((lon2 - lon1) * pi))) / 2;

  return Math.round(12756320 * Math.asin(Math.sqrt(a))); // 2 * R; R = 6378160 m
}

export async function calculateDistance2(
  building,
  userLat: number,
  userLng: number,
  buildingLat: number,
  buildingLng: number
) {
  const coordinates = [
    `${userLng},${userLat}`,
    `${buildingLng},${buildingLat}`,
  ].join(";");

  const url = new URL(
    `https://api.mapbox.com/directions/v5/mapbox/walking/${coordinates}`
  );
  const controller = new AbortController();

  url.searchParams.set("access_token", MAPBOX_ACCESS_TOKEN);
  url.searchParams.set("geometries", "geojson");
  url.searchParams.set("overview", "full");
  url.searchParams.set("steps", "false");

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      signal: controller.signal,
    });

    const responseBody = (await response.json()) as MapboxDirectionsResponse;

    const firstRoute = responseBody.routes?.[0];

    if (!isValidMapboxRoute(firstRoute)) {
      console.log(`failed building ${building.name}`);
      console.log(buildingLat);
      console.log(buildingLng);
      throw new Error("Mapbox did not return a usable walking route.");
    }

    console.log("API request HIT");
    console.log(firstRoute);

    return {
      distance: Math.round(firstRoute.distance),
      duration: Math.floor(firstRoute.duration / 60),
    };
  } catch (err) {
    console.error(err);
    if (err instanceof DOMException && err.name === "AbortError") {
      return null;
    }
  }

  return null;
}
