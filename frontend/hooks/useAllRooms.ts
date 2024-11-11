import { SearchResponse } from "@common/types";
import axios from "axios";
import { API_URL } from "config";
import useSWR from "swr/immutable";
import { AllRoomsFilters, Filters } from "types";

const fetcher = (url: string, filters: AllRoomsFilters /* datetime: Date */) =>
  axios
    .get(url, {
      params: filters,
    })
    .then((res) => res.data);

const useAllRooms = (filters: Filters) => {
  // TODO: add in datetime and filters
  // const datetime = useSelector(selectDatetime);
  // const filters = useSelector(selectFilters);

  const { data, isValidating, error } = useSWR<SearchResponse>(
    [API_URL + "/rooms/search", filters /*, datetime */],
    fetcher
  );

  return {
    rooms: data,
    isValidating,
    error,
  };
};

export default useAllRooms;
