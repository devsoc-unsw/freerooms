/**
 * Data fetching hook for ratings of a specified room
 */

import { BuildingRatingsResponse } from "@common//types";
import { API_URL } from "@frontend/config";
import axios from "axios";
import useSWRImmutable from "swr/immutable";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const useBuildingRatings = (buildingID?: string) => {
  const { data, error } = useSWRImmutable<BuildingRatingsResponse>(
    buildingID ? API_URL + "/buildingRating/" + buildingID : null,
    fetcher
  );

  return {
    ratings: data,
    error,
  };
};

export default useBuildingRatings;
