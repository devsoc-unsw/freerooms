import { SearchResponse } from "@common/types";
import axios from "axios";
import { API_URL } from "config";
import { useSelector } from "react-redux";
import useSWRImmutable from "swr/immutable";

const fetcher = (url: string /*, datetime: Date, filters: Filters*/) =>
  axios
    .get(url, {
      params: {
        /*datetime, ...filters*/
      },
    })
    .then((res) => res.data);

const useAllRooms = () => {
  // TODO: add in datetime and filters
  // const datetime = useSelector(selectDatetime);
  // const filters = useSelector(selectFilters);

  const { data, error } = useSWRImmutable<SearchResponse>(
    [API_URL + "/rooms/search" /*, datetime, filters*/],
    fetcher
  );

  return {
    rooms: data,
    error,
  };
};

export default useAllRooms;
