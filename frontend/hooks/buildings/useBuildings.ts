/**
 * Data fetching hook for data of all buildings
 */
import { BuildingsResponse } from "@common/types";
import { API_URL } from "@frontend/config";
import axios from "axios";
import useSWRImmutable from "swr/immutable";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const useBuildings = () => {
  const { data, error } = useSWRImmutable<BuildingsResponse>(
    API_URL + "/buildings",
    fetcher
  );
  return {
    buildings: data?.buildings,
    error,
  };
};

export default useBuildings;
