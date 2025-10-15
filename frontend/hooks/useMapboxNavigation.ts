import { Room } from "@common/types";
import mbxDirections from "@mapbox/mapbox-sdk/services/directions";
import useSWRImmutable from "swr/immutable";

import { MAPBOX_ACCESS_TOKEN } from "../config";

type MapboxRouteData = {
  geometry?: GeoJSON.LineString | GeoJSON.MultiLineString;
  distance_km?: number;
  duration_mins?: number;
  error?: any;
};

const fetchRoute = async (
  userLat: number | undefined,
  userLng: number | undefined,
  room: Room
  // roomLat: number | undefined,
  // roomLong: number | undefined
): Promise<MapboxRouteData> => {
  if (!MAPBOX_ACCESS_TOKEN) {
    throw new Error("Missing Mapbox access token");
  }

  if (!userLat || !userLng || !room.lat || !room.long) {
    throw new Error("Invalid user or room coordinate");
  }

  const directionsClient = mbxDirections({ accessToken: MAPBOX_ACCESS_TOKEN });

  const roomLat = room.lat;
  const roomLng = room.long;
  // let roomLat: number, roomLng: number;
  // if (room.geometry?.coordinates) {
  //   const last = room.geometry.coordinates[room.geometry.coordinates.length - 1];
  //   roomLng = last[0];
  //   roomLat = last[1];
  // } else {
  //   roomLat = room.lat;
  //   roomLng = room.long;
  // }

  // console.log(userLat, userLng, roomLat, roomLong);
  try {
    const response = await directionsClient
      .getDirections({
        profile: "walking", // or 'driving', 'cycling'
        geometries: "geojson",
        waypoints: [
          { coordinates: [userLng, userLat] },
          { coordinates: [roomLng, roomLat] },
        ],
      })
      .send();

    const route = response.body.routes[0];
    if (!route) {
      throw new Error("No route found");
    }

    return {
      geometry: route.geometry,
      distance_km: route.distance / 1000,
      duration_mins: route.duration / 60,
    };
    // return response.body.routes[0].geometry;
    // // TODO proper typing here
  } catch (err: any) {
    return { error: err.message || err };
  }
};

const useMapboxNavigation = (
  userLat: number | undefined,
  userLng: number | undefined,
  room: Room | undefined
): MapboxRouteData => {
  /** TODO add proper types */

  const { data } = useSWRImmutable([userLat, userLng, room], fetchRoute);

  return {
    geometry: data?.geometry,
    distance_km: data?.distance_km,
    duration_mins: data?.duration_mins,
    error: data?.error,
  };
};

export default useMapboxNavigation;
