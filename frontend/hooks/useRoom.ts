/**
 * Data fetching hook for data of specified room
 */
import useRooms from "./useRooms";

const useRoom = (roomId: string) => {
  const { rooms, error } = useRooms();

  // Error occurred while fetching all buildings
  if (error) {
    return { room: undefined, error };
  }

  // Still loading
  if (!rooms) {
    return { room: undefined, error }
  }

  // Try find building
  const room = rooms[roomId];
  if (!room) {
    return { room: undefined, error: new Error("No data for " + roomId) };
  }

  return { room, error };
}

export default useRoom;
