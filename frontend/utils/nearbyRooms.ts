import calculateDistance from "@frontend/utils/calculateDistance";
import { getBuildingIdFromRoomId } from "@frontend/utils/utils";
import type {
  Building,
  Room,
  RoomStatus,
  StatusResponse,
} from "common/types";

export type NearbyRoom = {
  room: Room;
  building: Building;
  status: RoomStatus;
  distance: number;
};

export const NEARBY_ROOM_LIMIT = 10;

export const getNearbyRooms = (
  currentRoomId: string,
  rooms: Record<string, Room>,
  buildings: Building[],
  statuses: StatusResponse,
  limit = NEARBY_ROOM_LIMIT
): NearbyRoom[] => {
  const buildingsById = new Map(
    buildings.map((building) => [building.id, building])
  );

  const currentBuilding = buildingsById.get(
    getBuildingIdFromRoomId(currentRoomId)
  );

  if (!currentBuilding) return [];

  const nearbyRooms: NearbyRoom[] = [];

  for (const room of Object.values(rooms)) {
    if (room.id === currentRoomId) continue;

    const buildingId = getBuildingIdFromRoomId(room.id);
    const building = buildingsById.get(buildingId);

    if (!building) continue;

    const roomNumber = room.id.split("-")[2];
    const status = statuses[buildingId]?.roomStatuses[roomNumber];

    if (status?.status !== "free") continue;

    const distance = calculateDistance(
      currentBuilding.lat,
      currentBuilding.long,
      building.lat,
      building.long
    );

    if (!Number.isFinite(distance)) continue;

    nearbyRooms.push({
      room,
      building,
      status,
      distance,
    });
  }

  return nearbyRooms
    .sort(
      (a, b) =>
        a.distance - b.distance ||
        a.room.name.localeCompare(b.room.name) ||
        a.room.id.localeCompare(b.room.id)
    )
    .slice(0, limit);
};