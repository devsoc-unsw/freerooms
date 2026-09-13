/**
 * Data fetching hook for ratings of a specified room
 */

import { Rating, RatingsResponse } from "@common//types";
import { API_URL } from "@frontend/config";
import axios from "axios";
import useSWRImmutable from "swr/immutable";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const useRoomRatings = (roomID?: string) => {
  const { data, error } = useSWRImmutable<RatingsResponse>(
    roomID ? API_URL + "/rating/" + roomID : null,
    fetcher
  );

  return {
    data: data,
    error,
  };
};

export default useRoomRatings;
