import mbxDirections from "@mapbox/mapbox-sdk/services/directions";
import { MAPBOX_ACCESS_TOKEN } from "../config";
import { Room } from "@common/types";
import useSWRImmutable from "swr/immutable";

const fetchRoute = async (
  userLat: number,
  userLng: number,
  roomLat: number,
  roomLong: number
) => {
  if (!MAPBOX_ACCESS_TOKEN) {
    throw new Error("Missing Mapbox access token");
  }

  const directionsClient = mbxDirections({ accessToken: MAPBOX_ACCESS_TOKEN });

  try {
    const response = await directionsClient
      .getDirections({
        profile: "walking", // or 'driving', 'cycling'
        geometries: "geojson",
        waypoints: [
          { coordinates: [userLng, userLat] },
          { coordinates: [roomLong, roomLat] },
        ],
      })
      .send();

    return response.body.routes[0].geometry;
    // TODO proper typing here
  } catch (error: any) {
    console.error("Route fetch error:", error.response?.body || error.message);
    throw error;
  }
};

const useMapboxNavigation = (userLat: number, userLng: number, room: Room) => {
  /** TODO add proper types */

  const { data, error } = useSWRImmutable(
    [userLat, userLng, room.lat, room.long],
    fetchRoute
  );

  return {
    geometry: data,
    error,
  };
};

export default useMapboxNavigation;
