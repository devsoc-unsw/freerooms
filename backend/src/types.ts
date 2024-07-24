import { Building, Room } from "@common/types";

export type BuildingDatabase = {
  [buildingId: string]: Building & {
    rooms: {
      [roomNumber: string]: Room;
    };
  };
};

export type StatusFilters = {
  capacity?: number;
  usage?: string;
  location?: "upper" | "lower";
  duration?: number;
  id?: boolean;
};

type BaseSearchFilters = StatusFilters & {
  buildingId?: string;
};

type SearchFiltersWithoutTime = BaseSearchFilters & {
  startTime?: never;
  endTime?: never;
};

type SearchFiltersWithTime = BaseSearchFilters & {
  startTime: Date;
  endTime: Date;
};

// Search filters must either not have both start and end time, or have both (cannot provide startTime without endTime)
export type SearchFilters = SearchFiltersWithoutTime | SearchFiltersWithTime;
