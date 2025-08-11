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
  console.log(userLat, userLng);
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
    console.log(error);
    throw error;
  }
};

const useMapboxNavigation = (
  userLat: number | undefined,
  userLng: number | undefined,
  room: Room | undefined
) => {
  /** TODO add proper types */

  console.log("TEST", room);
  const { data, error } = useSWRImmutable(
    [userLat, userLng, room ? room.lat : null, room ? room.long : null],
    fetchRoute
  );

  return {
    geometry: data,
    error,
  };
};

export default useMapboxNavigation;
