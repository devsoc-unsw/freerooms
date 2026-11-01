/**
 * Data fetching hook for all bookings of a given room
 * Uses datetime and filters from Redux store
 */
import parseDates from "@common/parseDates";
import { BookingsResponse } from "@common/types";
import { API_URL } from "@frontend/config";
import axios from "axios";
import useSWRImmutable from "swr/immutable";

const fetcher = (url: string) =>
  axios
    .get(url)
    .then((res) => res.data)
    .then(parseDates);

const useBookings = (roomId?: string) => {
  const { data, error } = useSWRImmutable<BookingsResponse>(
    roomId ? API_URL + "/rooms/bookings/" + roomId : null,
    fetcher
  );

  return {
    bookings: data?.bookings,
    error,
  };
};

export default useBookings;
