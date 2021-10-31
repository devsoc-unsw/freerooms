import { RoomStatus, Week } from "./types";

export interface Class {
  courseCode: string;
  start: string;
  end: string;
}

export interface Room {
  name: string;
  classes: Week;
}

export interface BuildingRoomStatus {
  rooms: {
    [roomId: string]: {
      status: RoomStatus;
      endtime: string;
    };
  };
}
