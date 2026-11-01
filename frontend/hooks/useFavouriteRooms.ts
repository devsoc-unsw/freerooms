import type { Room } from "@common/types";
import useBuildings from "@frontend/hooks/useBuildings";
import useFavourites from "@frontend/hooks/useFavourites";
import useRooms from "@frontend/hooks/useRooms";
import useStatus from "@frontend/hooks/useStatus";
import useUserLocation from "@frontend/hooks/useUserLocation";
import calculateDistance from "@frontend/utils/calculateDistance";
import { getRoomComparator } from "@frontend/utils/sortRooms";
import { getBuildingIdFromRoomId } from "@frontend/utils/utils";
import { useMemo } from "react";

const useFavouriteRooms = (query: string, sort: string): Room[] | undefined => {
  const { favourites } = useFavourites();
  const { rooms } = useRooms();
  const { status: roomStatusData } = useStatus();
  const { buildings } = useBuildings();
  const { userLat, userLng } = useUserLocation();

  return useMemo(() => {
    if (!rooms || !roomStatusData) return undefined;

    const statusOf = (room: Room) => {
      const [campus, grid, roomNumber] = room.id.split("-");
      return roomStatusData[`${campus}-${grid}`]?.roomStatuses[roomNumber];
    };

    const freeUntil = (room: Room): number => {
      const status = statusOf(room);
      if (status?.status !== "free") return -Infinity;
      const end = new Date(status.endtime).getTime();
      return Number.isNaN(end) ? Infinity : end;
    };

    const distance = (room: Room): number => {
      const building = buildings?.find(
        (b) => b.id === getBuildingIdFromRoomId(room.id)
      );
      if (!building || !userLat || !userLng) return Infinity;
      return calculateDistance(userLat, userLng, building.lat, building.long);
    };

    const savedRooms = favourites
      .map((id) => rooms[id])
      .filter((room): room is Room => room !== undefined);

    const matchingSearch = savedRooms.filter((room) =>
      room.name.toLowerCase().includes(query.toLowerCase())
    );

    // Browse hides buildings that have no rooms left after filtering. Same check is made here.
    const passingFilters = matchingSearch.filter(
      (room) => statusOf(room) !== undefined
    );

    return passingFilters.sort(getRoomComparator(sort, { freeUntil, distance }));
  }, [favourites, rooms, roomStatusData, buildings, userLat, userLng, query, sort]);
};

export default useFavouriteRooms;
