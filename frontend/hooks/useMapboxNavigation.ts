import mbxDirections from "@mapbox/mapbox-sdk/services/directions";
import { MAPBOX_ACCESS_TOKEN } from "../config";
import { Room } from "@common/types";
import useSWRImmutable from "swr/immutable";

const fetchRoute = async (
  userLat: number | undefined,
  userLng: number | undefined,
  roomLat: number | undefined,
  roomLong: number | undefined
) => {
  if (!MAPBOX_ACCESS_TOKEN) {
    throw new Error("Missing Mapbox access token");
  }

  if (!userLat || !userLng || !roomLat || !roomLong) {
    throw new Error("Invalid user or room coordinate");
  }

  const directionsClient = mbxDirections({ accessToken: MAPBOX_ACCESS_TOKEN });
  console.log(userLat, userLng, roomLat, roomLong);
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

    console.log("TEST", response.body.routes[0].geometry);
    return response.body.routes[0].geometry;
    // TODO proper typing here
  } catch (error: any) {
    throw error;
  }
};

const useMapboxNavigation = (
  userLat: number | undefined,
  userLng: number | undefined,
  room: Room | undefined
) => {
  /** TODO add proper types */

  const { data, error } = useSWRImmutable(
    [
      userLat,
      userLng,
      room ? room.lat : undefined,
      room ? room.long : undefined,
    ],
    fetchRoute
  );

  return {
    geometry: data,
    error,
  };
};

export default useMapboxNavigation;
