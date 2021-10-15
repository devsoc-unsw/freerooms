import { Class, Room } from "./interfaces";

export type ClassList = Class[];

export type Week = Record<string, Day>;

export type Day = Record<string, ClassList>;

export type Building = Record<string, Room>;

export type TimetableData = Record<string, Building>;
