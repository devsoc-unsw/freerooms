import { RoomsReturnData } from "../types";

const INITIALISING = -2;
const FAILED = -1;

export const getNumFreerooms = (
  roomStatus: RoomsReturnData | undefined,
  buildingId: string
): number => {
  if (roomStatus === undefined) return INITIALISING;
  if (!(buildingId in roomStatus)) return FAILED;

  let freerooms = 0;
  for (const room of Object.values(roomStatus[buildingId])) {
    if (room.status === "free") freerooms++;
  }
  return freerooms;
};
