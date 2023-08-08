/**
 * Data fetching hook for data of all rooms
 */
import axios from "axios";
import useSWRImmutable from 'swr/immutable'

import { API_URL } from "../config";
import { RoomsResponse } from "../types";

const fetcher = (url: string) => axios.get(url).then(res => res.data.rooms);

const useRooms = () => {
  const { data, error } = useSWRImmutable<RoomsResponse>(API_URL + "/rooms", fetcher);
  return {
    rooms: data,
    error
  };
}

export default useRooms;
