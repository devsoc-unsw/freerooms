import { API_URL } from "@frontend/config";
import useBuildings from "@frontend/hooks/buildings/useBuildings";
import useRooms from "@frontend/hooks/rooms/useRooms";
import { getNearbyRooms } from "@frontend/utils/nearbyRooms";
import axios from "axios";
import type { StatusResponse } from "common/types";
import { useMemo } from "react";
import useSWR from "swr";

const REFRESH_INTERVAL_MS = 60 * 1000;

const fetcher = async (url: string): Promise<StatusResponse> => {
  const response = await axios.get<StatusResponse>(url);
  return response.data;
};

const useNearbyRooms = (currentRoomId?: string) => {
  const { rooms, error: roomsError } = useRooms();
  const { buildings, error: buildingsError } = useBuildings();

  const { data: statuses, error: statusError } = useSWR<StatusResponse>(
    currentRoomId ? `${API_URL}/rooms/status` : null,
    fetcher,
    {
      refreshInterval: REFRESH_INTERVAL_MS,
      revalidateOnFocus: true,
    }
  );

  const error = roomsError ?? buildingsError ?? statusError;

  const nearbyRooms = useMemo(() => {
    if (!currentRoomId || !rooms || !buildings || !statuses || error) {
      return undefined;
    }

    return getNearbyRooms(currentRoomId, rooms, buildings, statuses);
  }, [currentRoomId, rooms, buildings, statuses, error]);

  return {
    nearbyRooms,
    error,
    isLoading: !error && nearbyRooms === undefined,
  };
};

export default useNearbyRooms;
