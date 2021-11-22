import { Class, Room } from "./interfaces";

export type ClassList = Class[];

export type Day = Record<string, ClassList>;

export type Week = Record<string, Day>;

export type Building = Record<string, Room>;

export type TimetableData = Record<string, Building>;

export type RoomStatus = "free" | "soon" | "busy";

export type ScraperData = {
  termStart: string;
} & ScraperBuildingData;

export type ScraperBuildingData = {
  [buildingId: string]: {
    [roomId: string]: {
      roomName: string;
      [week: number]: {
        [day: string]: ClassList;
      };
    };
  };
};

export type BuildingData = {
  name: string;
  id: string;
  img: string;
};
