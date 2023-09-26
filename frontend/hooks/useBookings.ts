/**
 * Data fetching hook for all bookings of a given room
 * Uses datetime and filters from Redux store
 */
import parseDates from "@common/parseDates";
import { BookingsResponse } from "@common/types";
import axios from "axios";
import useSWRImmutable from 'swr/immutable'

import { API_URL } from "../config";

const fetcher = (url: string) => axios.get(url).then(res => res.data).then(parseDates);

const useBookings = (roomId: string) => {
  const { data, error } = useSWRImmutable<BookingsResponse>(
    API_URL + "/rooms/bookings/" + roomId,
    fetcher
  );

  return {
    bookings: data?.bookings,
    error
  };
}

export default useBookings;
