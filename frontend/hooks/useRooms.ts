/**
 * Data fetching hook for data of all rooms
 */
import { RoomsResponse } from "@common//types";
import axios from "axios";
import useSWRImmutable from 'swr/immutable'

import { API_URL } from "../config";

const fetcher = (url: string) => axios.get(url).then(res => res.data);

const useRooms = () => {
  const { data, error } = useSWRImmutable<RoomsResponse>(API_URL + "/rooms", fetcher);
  return {
    rooms: data?.rooms,
    error
  };
}

export default useRooms;
