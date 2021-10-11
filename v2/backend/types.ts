import { Class } from "./interfaces";

export type ClassList = Class[];

export type Day = Record<string, ClassList>;

export type Room = {
  name: string;
  [classes: string]: Day;
};

export type Building = Record<string, Room>;

export type TimetableData = Record<string, Building>;
