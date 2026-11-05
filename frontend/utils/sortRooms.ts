import { getBuildingGridNumber } from "@frontend/utils/roomLocation";
import { getBuildingIdFromRoomId } from "@frontend/utils/utils";
import type { Room } from "common/types";

export type RoomSortInputs = {
  freeUntil: (room: Room) => number; // later means free for longer
  distance: (room: Room) => number; // from the user, Infinity if unknown
};

const compareNumbers = (a: number, b: number): number =>
  a === b ? 0 : a < b ? -1 : 1;

const compareNames = (a: Room, b: Room): number => a.name.localeCompare(b.name);

const gridNumberOf = (room: Room): number =>
  getBuildingGridNumber(getBuildingIdFromRoomId(room.id));

export const getRoomComparator =
  (sort: string, { freeUntil, distance }: RoomSortInputs) =>
  (a: Room, b: Room): number => {
    let primary = 0;

    switch (sort) {
      case "longestAvailable":
        primary = compareNumbers(freeUntil(b), freeUntil(a));
        break;
      case "capacity":
        primary = compareNumbers(Number(b.capacity), Number(a.capacity));
        break;
      case "nearest":
        primary = compareNumbers(distance(a), distance(b));
        break;
      case "lowerToUpper":
        primary = compareNumbers(gridNumberOf(a), gridNumberOf(b));
        break;
      case "upperToLower":
        primary = compareNumbers(gridNumberOf(b), gridNumberOf(a));
        break;
      case "reverseAlphabetical":
        return compareNames(b, a);
      default:
        break;
    }

    // Rooms that tie are ordered by name/alphabetical
    return primary || compareNames(a, b);
  };
