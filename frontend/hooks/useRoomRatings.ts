/**
 * Data fetching hook for ratings of a specified room
 */

import { RatingsResponse } from "@common//types";
import axios from "axios";
import useSWRImmutable from "swr/immutable";

import { API_URL } from "../config";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const useRoomRatings = (roomID: string) => {
  const { data, error } = useSWRImmutable<RatingsResponse>(
    API_URL + "/rating/" + roomID,
    fetcher
  );

  return {
    ratings: data,
    error,
  };
};

export default useRoomRatings;
