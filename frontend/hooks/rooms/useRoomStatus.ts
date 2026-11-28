/**
 * Data fetching hook for status of a specific room
 * Uses datetime and filters from Redux store
 */
import useBuildingStatus from "@frontend/hooks/buildings/useBuildingStatus";

const useRoomStatus = (roomId?: string) => {
  const [campus, grid, roomNumber] = (roomId ?? "").split("-");
  const { status, error } = useBuildingStatus(
    roomId ? `${campus}-${grid}` : undefined
  );

  // No id yet (e.g. a loading placeholder card), still loading, or failed
  if (!roomId || error || !status) {
    return { status: undefined, error };
  }

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
