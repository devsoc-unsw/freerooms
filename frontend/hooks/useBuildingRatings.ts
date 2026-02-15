/**
 * Data fetching hook for ratings of a specified room
 */

import { BuildingRatingsResponse } from "@common//types";
import axios from "axios";
import useSWRImmutable from "swr/immutable";

import { API_URL } from "../config";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const useBuildingRatings = (buildingID: string) => {
  const { data, error } = useSWRImmutable<BuildingRatingsResponse>(
    API_URL + "/buildingRating/" + buildingID,
    fetcher
  );

  return {
    ratings: data,
    error,
  };
};

export default useBuildingRatings;
