import { roomUsages } from "@common/roomUsages";
import { DropDown } from "types";

// Dropdown & items for FilterBar in building browse page
export const filterBarDropdown: DropDown[] = [
  {
    text: "Room Type",
    key: "usage",
    items: Object.entries(roomUsages).map(([abbr, usage]) => ({
      text: usage,
      value: abbr,
    })),
  },
  {
    text: "Room Capacity",
    key: "capacity",
    items: [
      {
        text: "25+",
        value: "25",
      },
      {
        text: "50+",
        value: "50",
      },
      {
        text: "100+",
        value: "100",
      },
      {
        text: "200+",
        value: "200",
      },
    ],
  },
  {
    text: "Duration Free",
    key: "duration",
    items: [
      {
        text: "30+ minutes",
        value: "30",
      },
      {
        text: "1+ hours",
        value: "60",
      },
      {
        text: "2+ hours",
        value: "120",
      },
      {
        text: "3+ hours",
        value: "180",
      },
    ],
  },
  {
    text: "Location",
    key: "location",
    items: [
      {
        text: "Upper Campus",
        value: "upper",
      },
      {
        text: "Lower Campus",
        value: "lower",
      },
    ],
  },
  {
    text: "ID Required",
    key: "id",
    items: [
      {
        text: "Not Required",
        value: "false",
      },
      {
        text: "Required",
        value: "true",
      },
    ],
  },
];

// Dropdowns and items for FilterSideBar in all-rooms-page
export const allRoomsFilterDropdown: DropDown[] = [
  {
    text: "Room Type",
    key: "usage",
    items: Object.entries(roomUsages).map(([abbr, usage]) => ({
      text: usage,
      value: abbr,
    })),
  },
  {
    text: "Location",
    key: "location",
    items: [
      {
        text: "Upper Campus",
        value: "upper",
      },
      {
        text: "Lower Campus",
        value: "lower",
      },
    ],
  },
  {
    text: "Duration Free",
    key: "duration",
    items: [
      {
        text: "30+ minutes",
        value: "30",
      },
      {
        text: "1+ hours",
        value: "60",
      },
      {
        text: "2+ hours",
        value: "120",
      },
      {
        text: "3+ hours",
        value: "180",
      },
    ],
  },
];
