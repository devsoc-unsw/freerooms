/**
 * Typo-tolerant search over buildings and the rooms listed in them
 */
import { Building, Room } from "@common/types";
import Fuse from "fuse.js";
import React from "react";

const useBuildingSearch = (
  buildings: Building[] | undefined,
  rooms: { [roomId: string]: Room } | undefined
) => {
  // One searchable entry per building: its name, code and aliases, plus the
  // code, name and abbreviation of each room currently listed for it
  const fuse = React.useMemo(() => {
    if (!buildings) return undefined;

    const allRooms = Object.values(rooms ?? {});

    const entries = buildings.map((building) => ({
      id: building.id,
      searchKeys: [
        building.name,
        building.id,
        ...building.aliases,
        // Room ids are `${buildingId}-${roomNumber}`, e.g. "K-J17-101"
        ...allRooms
          .filter((room) => room.id.startsWith(`${building.id}-`))
          .flatMap((room) => [room.id, room.name, room.abbr, room.school]),
      ].filter((key) => key.trim() !== ""), // rooms without a school have " "
    }));

    return new Fuse(entries, {
      keys: ["searchKeys"],
      threshold: 0.3, // 0 = exact only, 1 = matches anything
      ignoreLocation: true,
    });
  }, [buildings, rooms]);

  /**
   * Returns the ids of buildings matching the query, or undefined when there
   * is nothing to filter by (empty query, or data not loaded yet)
   */
  return React.useCallback(
    (query: string): Set<string> | undefined => {
      const q = query.trim();
      if (!q || !fuse) return undefined;
      return new Set(fuse.search(q).map((result) => result.item.id));
    },
    [fuse]
  );
};

export default useBuildingSearch;
