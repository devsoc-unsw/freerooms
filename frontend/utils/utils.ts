import { BuildingStatus } from "@common/types";

const INITIALISING = -2;
const FAILED = -1;

export const getNumFreerooms = (
  buildingStatus: BuildingStatus | undefined
): number => {
  if (buildingStatus === undefined) return INITIALISING;

  let freerooms = 0;
  for (const room of Object.values(buildingStatus)) {
    if (room.status === "free") freerooms++;
  }
  return freerooms;
};

export const getTotalRooms = (
  buildingStatus: BuildingStatus | undefined
): number => {
  if (buildingStatus === undefined) return INITIALISING;

  return Object.values(buildingStatus).length;
};
