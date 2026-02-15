/**
 * Data fetching hook for status of all rooms
 * Uses datetime and filters from Redux store
 */
import { StatusResponse } from "@common/types";
import axios from "axios";
import useSWRImmutable from "swr/immutable";

import { API_URL } from "../config";
import { selectDatetime } from "../redux/datetimeSlice";
import { selectFilters } from "../redux/filtersSlice";
import { useSelector } from "../redux/hooks";
import { Filters } from "../types";

const fetcher = (url: string, datetime: Date, filters: Filters) =>
  axios.get(url, { params: { datetime, ...filters } }).then((res) => res.data);

const useStatus = () => {
  const datetime = useSelector(selectDatetime);
  const filters = useSelector(selectFilters);

  const { data, error } = useSWRImmutable<StatusResponse>(
    [API_URL + "/rooms/status", datetime, filters],
    fetcher
  );

  return {
    status: data,
    error,
  };
};

export default useStatus;
