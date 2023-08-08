/**
 * Data fetching hook for all bookings of a given room
 * Uses datetime and filters from Redux store
 */
import axios from "axios";
import useSWRImmutable from 'swr/immutable'

import { API_URL } from "../config";
import { Class } from "../types";

const fetcher = (url: string) => axios.get(url).then(res => res.data.bookings);

const useBookings = (roomId: string) => {
  const { data, error } = useSWRImmutable<Class[]>(
    API_URL + "/rooms/bookings/" + roomId,
    fetcher
  );

  return {
    bookings: data,
    error
  };
}

export default useBookings;
