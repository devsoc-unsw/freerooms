import { getBuildingIdFromRoomId } from "@frontend/utils/utils";
import translateRoomUsage from "common/roomUsages";
import { Building, Room } from "common/types";
import Fuse from "fuse.js";
import React from "react";

const useRoomSearch = (rooms: Room[], buildings: Building[] | undefined) => {
  const fuse = React.useMemo(() => {
    const entries = rooms.map((room) => {
      const buildingId = getBuildingIdFromRoomId(room.id);
      const building = buildings?.find((b) => b.id === buildingId);
      return {
        id: room.id,
        searchKeys: [
          room.name,
          room.id,
          room.abbr,
          translateRoomUsage(room.usage) ?? "",
          ...(building
            ? [building.name, building.id, ...building.aliases]
            : []),
        ].filter((key) => key.trim() !== ""),
      };
    });

    return new Fuse(entries, {
      keys: ["searchKeys"],
      threshold: 0.3, // same tuning as useBuildingSearch
      ignoreLocation: true,
    });
  }, [rooms, buildings]);

  return React.useCallback(
    (query: string): Set<string> | undefined => {
      const q = query.trim();
      if (!q) return undefined;
      return new Set(fuse.search(q).map((result) => result.item.id));
    },
    [fuse]
  );
};

export default useRoomSearch;
