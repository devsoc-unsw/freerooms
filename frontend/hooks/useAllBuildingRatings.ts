/**
 * Data fetching hook for ratings of all buildings
 */

import { BuildingRatingsResponse } from "@common//types";
import { API_URL } from "@frontend/config";
import axios from "axios";
import useSWRImmutable from "swr/immutable";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const useAllBuildingRatings = () => {
  const { data, error } = useSWRImmutable<BuildingRatingsResponse[]>(
    API_URL + "/buildingRating",
    fetcher
  );

  return {
    ratings: data,
    error,
  };
};

export default useAllBuildingRatings;
