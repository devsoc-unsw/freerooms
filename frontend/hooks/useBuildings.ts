/**
 * Data fetching hook for data of all buildings
 */
import { BuildingsResponse } from "@common/types";
import axios from "axios";
import useSWRImmutable from 'swr/immutable'

import { API_URL } from "../config";

const fetcher = (url: string) => axios.get(url).then(res => res.data);

const useBuildings = () => {
  const { data, error } = useSWRImmutable<BuildingsResponse>(API_URL + "/buildings", fetcher);
  return {
    buildings: data?.buildings,
    error
  };
}

export default useBuildings;
