import { MAPBOX_ACCESS_TOKEN } from "@frontend/config";
import calculateDistance from "@frontend/utils/calculateDistance";
import { Building } from "common/types";
import { useEffect, useRef, useState } from "react";

const MAX_DESTINATIONS_PER_REQUEST = 24;
const MIN_DISTANCE_FOR_API_REQ = 100;
const MIN_TIME_INTERVAL_FOR_API_REQ_MS = 120000;

type MapboxMatrixResponse = {
  code?: string;
  message?: string;
  distances?: (number | null)[][];
  durations?: (number | null)[][];
};

type WalkingMatrix = {
  distances: (number | undefined)[];
  durations: (number | undefined)[];
};

const EMPTY_MATRIX: WalkingMatrix = { distances: [], durations: [] };

const fetchMatrixChunk = async (
  userLat: number,
  userLng: number,
  buildings: Building[],
  signal: AbortSignal
) => {
  const coordinates = [
    `${userLng},${userLat}`,
    ...buildings.map((building) => `${building.long},${building.lat}`),
  ].join(";");

  const url = new URL(
    `https://api.mapbox.com/directions-matrix/v1/mapbox/walking/${coordinates}`
  );
  url.searchParams.set("access_token", MAPBOX_ACCESS_TOKEN);
  url.searchParams.set("sources", "0");
  url.searchParams.set(
    "destinations",
    buildings.map((_, index) => index + 1).join(";")
  );
  url.searchParams.set("annotations", "distance,duration");

  try {
    const response = await fetch(url.toString(), { signal });
    const responseBody = (await response.json()) as MapboxMatrixResponse;
    return {
      distances: responseBody.distances?.[0] ?? [],
      durations: responseBody.durations?.[0] ?? [],
    };
  } catch (err) {
    console.error(err);
    if (err instanceof DOMException && err.name === "AbortError") {
      return null;
    }
  }

  return null;
};

const useWalkingMatrix = (
  userLat: number | undefined,
  userLng: number | undefined,
  buildings: Building[] | undefined,
  enabled: boolean
) => {
  const [matrix, setMatrix] = useState<WalkingMatrix>(EMPTY_MATRIX);
  const lastFetchedRef = useRef<{
    lat: number;
    lng: number;
    fetchedAt: number;
    buildings: Building[];
  } | null>(null);

  useEffect(() => {
    if (
      !enabled ||
      !buildings ||
      userLat === undefined ||
      userLng === undefined
    ) {
      // Forget the last fetch so it refetches when re-enabled
      lastFetchedRef.current = null;
      return;
    }

    const last = lastFetchedRef.current;
    // Checks if the user's new location is at least 100 metres away from old location
    if (
      last &&
      calculateDistance(userLat, userLng, last.lat, last.lng) <
        MIN_DISTANCE_FOR_API_REQ
    ) {
      return;
    }

    // Cooldown timer (2 minutes) as user's can still spoof their location
    if (
      last &&
      Date.now() - last.fetchedAt < MIN_TIME_INTERVAL_FOR_API_REQ_MS
    ) {
      return;
    }

    const controller = new AbortController();

    const indexes = buildings
      .map((building, i) =>
        building.lat === 0 && building.long === 0 ? -1 : i
      )
      .filter((i) => i !== -1);

    const chunks: number[][] = [];
    for (let i = 0; i < buildings.length; i += MAX_DESTINATIONS_PER_REQUEST) {
      chunks.push(indexes.slice(i, i + MAX_DESTINATIONS_PER_REQUEST));
    }

    Promise.all(
      chunks.map((chunk) =>
        fetchMatrixChunk(
          userLat,
          userLng,
          chunk.map((i) => buildings[i]),
          controller.signal
        )
      )
    )
      .then((results) => {
        const distances: (number | undefined)[] = buildings.map(
          () => undefined
        );
        const durations: (number | undefined)[] = buildings.map(
          () => undefined
        );

        results.forEach((result, chunkIndex) => {
          // A failed or cancelled chunk leaves its buildings without values
          if (!result) {
            return;
          }

          chunks[chunkIndex].forEach((buildingIndex, i) => {
            const distance = result.distances[i];
            const duration = result.durations[i];
            if (distance != null) {
              distances[buildingIndex] = Math.round(distance);
            }
            if (duration != null) {
              durations[buildingIndex] = duration;
            }
          });
        });

        lastFetchedRef.current = {
          lat: userLat,
          lng: userLng,
          fetchedAt: Date.now(),
          buildings,
        };
        setMatrix({ distances, durations });
      })
      .catch((err) => {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        console.error("Walking distances could not be loaded:", err);
      });

    return () => {
      controller.abort();
    };
  }, [buildings, userLat, userLng, enabled]);

  const isActive =
    enabled &&
    buildings !== undefined &&
    userLat !== undefined &&
    userLng !== undefined;

  return isActive ? matrix : EMPTY_MATRIX;
};

export default useWalkingMatrix;
