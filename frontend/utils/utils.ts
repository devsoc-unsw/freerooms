import { BuildingStatus } from "@common/types";

const INITIALISING = -2;
const FAILED = -1;

export const getNumFreerooms = (
  buildingStatus: BuildingStatus | undefined
): number => {
  if (buildingStatus === undefined) return INITIALISING;

  return buildingStatus.numAvailable;
};

export const getTotalRooms = (
  buildingStatus: BuildingStatus | undefined
): number => {
  if (buildingStatus === undefined) return INITIALISING;

  return Object.values(buildingStatus.roomStatuses).length;
};

//gets the building id from a room id
export const getBuildingIdFromRoomId = (roomId: string): string => {
  return roomId.split("-").slice(0, 2).join("-");
};
