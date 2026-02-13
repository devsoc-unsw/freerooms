/**
 * Data fetching hook for utility tags of a specified room
 */

import { RoomUtilitiesResponse } from "@common/types";
import axios from "axios";
import useSWRImmutable from "swr/immutable";
import { BACKEND_URL } from "../config";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const useRoomUtilities = (roomID: string) => {
  const { data, error } = useSWRImmutable<RoomUtilitiesResponse>(
    BACKEND_URL + "/rooms/utilities/" + roomID,
    fetcher
  );

  return {
    utilities: data,
    error,
  };
};

export default useRoomUtilities;
