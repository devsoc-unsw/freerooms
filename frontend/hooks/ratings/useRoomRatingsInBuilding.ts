/**
 * Data fetching hook for ratings in a specified building
 */

import { RatingsResponse } from "@common//types";
import { API_URL } from "@frontend/config";
import axios from "axios";
import useSWRImmutable from "swr/immutable";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const useAllRoomRatingsInBuilding = (buildingID?: string) => {
  const { data, error } = useSWRImmutable<RatingsResponse[]>(
    buildingID ? API_URL + "/rating/rooms/" + buildingID : null,
    fetcher
  );

  return {
    data: data,
    error,
  };
};

export default useAllRoomRatingsInBuilding;
