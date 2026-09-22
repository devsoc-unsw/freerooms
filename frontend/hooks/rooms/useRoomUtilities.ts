/**
 * Data fetching hook for utility tags of a specified room
 */

import { RoomUtilitiesResponse } from "@common/types";
import { API_URL } from "@frontend/config";
import axios from "axios";
import useSWRImmutable from "swr/immutable";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const useRoomUtilities = (roomID?: string) => {
  const { data, error } = useSWRImmutable<RoomUtilitiesResponse>(
    roomID ? API_URL + "/rooms/utilities/" + roomID : null,
    fetcher
  );

  return {
    utilities: data,
    error,
  };
};

export default useRoomUtilities;
