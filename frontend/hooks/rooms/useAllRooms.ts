import { SearchResponse } from "@common/types";
import { API_URL } from "@frontend/config";
import { useSelector } from "@frontend/redux/hooks";
import { selectDatetime } from "@frontend/redux/slices/datetimeSlice";
import { AllRoomsFilters } from "@frontend/types";
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
