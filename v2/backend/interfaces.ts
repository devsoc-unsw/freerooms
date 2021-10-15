import { Week } from "./types";

export interface Class {
  courseCode: string;
  start: string;
  end: string;
}

export interface Room {
  name: string;
  classes: Week;
};
