import { SearchResponse } from "@common/types";
import axios from "axios";
import { API_URL } from "config";
import useSWR from "swr/immutable";
import { AllRoomsFilters, Filters } from "types";

import { selectDatetime } from "../redux/datetimeSlice";
import { useSelector } from "../redux/hooks";

const fetcher = (url: string, datetime: Date, filters: AllRoomsFilters) =>
  axios
    .get(url, {
      params: { datetime, ...filters },
    })
    .then((res) => res.data);

const useAllRooms = (filters: AllRoomsFilters) => {
  const datetime = useSelector(selectDatetime);

  const { data, isValidating, error } = useSWR<SearchResponse>(
    [API_URL + "/rooms/search", datetime, filters],
    fetcher
  );

  return {
    rooms: data,
    isValidating,
    error,
  };
};

export default useAllRooms;
