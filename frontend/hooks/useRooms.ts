/**
 * Data fetching hook for data of all rooms
 */
<<<<<<< HEAD
import { RoomsResponse } from "@common//types";
=======
>>>>>>> a27b7d9 (feat(backend): create and adopt `/api/rooms` endpoint for room data (#401))
import axios from "axios";
import useSWRImmutable from 'swr/immutable'

import { API_URL } from "../config";
<<<<<<< HEAD

const fetcher = (url: string) => axios.get(url).then(res => res.data);
=======
import { RoomsResponse } from "../types";

const fetcher = (url: string) => axios.get(url).then(res => res.data.rooms);
>>>>>>> a27b7d9 (feat(backend): create and adopt `/api/rooms` endpoint for room data (#401))

const useRooms = () => {
  const { data, error } = useSWRImmutable<RoomsResponse>(API_URL + "/rooms", fetcher);
  return {
<<<<<<< HEAD
    rooms: data?.rooms,
=======
    rooms: data,
>>>>>>> a27b7d9 (feat(backend): create and adopt `/api/rooms` endpoint for room data (#401))
    error
  };
}

export default useRooms;
