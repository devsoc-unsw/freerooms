import useBuildings from "@frontend/hooks/buildings/useBuildings";
import useUserLocation from "@frontend/hooks/map/useUserLocation";
import useFavourites from "@frontend/hooks/rooms/useFavourites";
import useRoomSearch from "@frontend/hooks/rooms/useRoomSearch";
import useRooms from "@frontend/hooks/rooms/useRooms";
import useStatus from "@frontend/hooks/rooms/useStatus";
import calculateDistance from "@frontend/utils/calculateDistance";
import { getRoomComparator } from "@frontend/utils/sortRooms";
import { getBuildingIdFromRoomId } from "@frontend/utils/utils";
import type { Room } from "common/types";
import { useMemo } from "react";

const NO_ROOMS: Room[] = [];

const useDisplayedFavouriteRooms = (
  query: string,
  sort: string,
  availableOnly: boolean
): Room[] | undefined => {
  const { favourites } = useFavourites();
  const { rooms } = useRooms();
  const { status: roomStatusData } = useStatus();
  const { buildings } = useBuildings();
  const { userLat, userLng } = useUserLocation();

  const savedRooms = useMemo(() => {
    if (!rooms) return undefined;
    return Array.from(new Set(favourites))
      .map((id) => rooms[id])
      .filter((room): room is Room => room !== undefined);
  }, [favourites, rooms]);

  const searchRooms = useRoomSearch(savedRooms ?? NO_ROOMS, buildings);

  return useMemo(() => {
    if (!savedRooms || !roomStatusData) return undefined;

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

    const matchingIds = searchRooms(query);
    const matchingSearch = matchingIds
      ? savedRooms.filter((room) => matchingIds.has(room.id))
      : savedRooms;

    // Browse hides buildings that have no rooms left after filtering. Same check is made here.
    const passingFilters = matchingSearch.filter((room) => {
      const status = statusOf(room);
      if (!status) return false;
      return !availableOnly || status.status === "free";
    });

    return passingFilters.sort(
      getRoomComparator(sort, { freeUntil, distance })
    );
  }, [
    savedRooms,
    roomStatusData,
    buildings,
    userLat,
    userLng,
    searchRooms,
    query,
    sort,
    availableOnly,
  ]);
};

export default useDisplayedFavouriteRooms;