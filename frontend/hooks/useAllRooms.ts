import { SearchResponse } from "@common/types";
import { API_URL } from "@frontend/config";
import { selectDatetime } from "@frontend/redux/datetimeSlice";
import { useSelector } from "@frontend/redux/hooks";
import { AllRoomsFilters, Filters } from "@frontend/types";
import axios from "axios";
import useSWR from "swr/immutable";

const fetcher = ([url, datetime, filters]: [string, Date, AllRoomsFilters]) =>
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
