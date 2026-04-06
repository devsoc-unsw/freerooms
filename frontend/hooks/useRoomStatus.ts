/**
 * Data fetching hook for status of specific room
 * Uses datetime and filters from Redux store
 */
import useBuildingStatus from "./useBuildingStatus";

const useRoomStatus = (roomId: string) => {
  const [campus, grid, roomNumber] = roomId.split("-");

  const { status, error } = useBuildingStatus(`${campus}-${grid}`);

  // Error occurred while fetching all buildings
  if (error) {
    return { status: undefined, error };
  }

  // Still loading
  if (!status) {
    return { status: undefined, error };
  }

  // Try find building
  const roomStatus = status.roomStatuses[roomNumber];
  if (!roomStatus) {
    return {
      status: undefined,
      error: new Error("No status data for " + roomId),
    };
  }

  return { status: roomStatus, error };
};

export default useRoomStatus;
