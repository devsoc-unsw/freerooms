/**
 * Data fetching hook for all bookings of a given room
 * Uses datetime and filters from Redux store
 */
<<<<<<< HEAD
import parseDates from "@common/parseDates";
=======
>>>>>>> 599e782 (feat: use common folder for shared code (e.g. data types) (#402))
import { BookingsResponse } from "@common/types";
import axios from "axios";
import useSWRImmutable from 'swr/immutable'

import { API_URL } from "../config";
<<<<<<< HEAD
<<<<<<< HEAD

const fetcher = (url: string) => axios.get(url).then(res => res.data).then(parseDates);

const useBookings = (roomId: string) => {
  const { data, error } = useSWRImmutable<BookingsResponse>(
=======
import { Class } from "../types";
=======
import parseDates from "../utils/parseDates";
>>>>>>> 599e782 (feat: use common folder for shared code (e.g. data types) (#402))

const fetcher = (url: string) => axios.get(url).then(res => res.data).then(parseDates);

const useBookings = (roomId: string) => {
<<<<<<< HEAD
  const { data, error } = useSWRImmutable<Class[]>(
>>>>>>> a27b7d9 (feat(backend): create and adopt `/api/rooms` endpoint for room data (#401))
=======
  const { data, error } = useSWRImmutable<BookingsResponse>(
>>>>>>> 599e782 (feat: use common folder for shared code (e.g. data types) (#402))
    API_URL + "/rooms/bookings/" + roomId,
    fetcher
  );

  return {
    bookings: data?.bookings,
    error
  };
}

export default useBookings;
