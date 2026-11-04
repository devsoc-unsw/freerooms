import { DropDown, DropDownItem } from "@frontend/types";
import ContactEmergencyOutlinedIcon from "@mui/icons-material/ContactEmergencyOutlined";
import DoorBackOutlinedIcon from "@mui/icons-material/DoorBackOutlined";
import EventRepeatOutlinedIcon from "@mui/icons-material/EventRepeatOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import { roomUsages } from "common/roomUsages";

const MAX_RECURRING = 10;
const recurringWeekItems: DropDownItem[] = Array.from(
  { length: MAX_RECURRING },
  (_, index) => {
    const weeks = index + 1;
    return {
      text: weeks === 1 ? "1 week" : `${weeks} weeks`,
      value: `${weeks}`,
    };
  }
);

// Dropdown & items for FilterBar in building browse page
export const filterBarDropdown: DropDown[] = [
  {
    text: "Campus Location",
    key: "location",
    icon: PlaceOutlinedIcon,
    items: [
      {
        text: "Lower",
        value: "lower",
      },
      {
        text: "Upper",
        value: "upper",
      },
    ],
  },
  {
    text: "Room Capacity",
    key: "capacity",
    icon: PeopleAltOutlinedIcon,
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
    text: "Room Type",
    key: "usage",
    icon: DoorBackOutlinedIcon,
    items: Object.entries(roomUsages)
      .map(([abbr, usage]) => ({ text: usage, value: abbr }))
      .sort((a, b) => a.text.localeCompare(b.text)),
  },
  {
    text: "ID Required",
    key: "id",
    icon: ContactEmergencyOutlinedIcon,
    items: [
      {
        text: "Yes",
        value: "true",
      },
      {
        text: "No",
        value: "false",
      },
    ],
  },
  {
    text: "Duration Free",
    key: "duration",
    icon: TimerOutlinedIcon,
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
    text: "Recurring",
    key: "recurring",
    icon: EventRepeatOutlinedIcon,
    items: recurringWeekItems,
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
  {
    text: "Recurring",
    key: "recurring",
    items: recurringWeekItems,
  },
];

// Dropdowns and items for SortBar in building browse page
export const sortBarDropdown: DropDownItem[] = [
  {
    text: "Most Available Rooms",
    value: "mostRooms",
  },
  {
    text: "Nearest",
    value: "nearest",
  },
  {
    text: "Alphabetical",
    value: "alphabetical",
  },
  {
    text: "Reverse Alphabetical",
    value: "reverseAlphabetical",
  },
  {
    text: "Lower Campus",
    value: "lowerToUpper",
  },
  {
    text: "Upper Campus",
    value: "upperToLower",
  },
];

// Sorts for individual rooms
export const roomSortBarDropdown: DropDownItem[] = [
  {
    text: "Availability duration",
    value: "longestAvailable",
  },
  {
    text: "Room Capacity",
    value: "capacity",
  },
  {
    text: "Nearest",
    value: "nearest",
  },
  {
    text: "Alphabetical",
    value: "alphabetical",
  },
  {
    text: "Reverse Alphabetical",
    value: "reverseAlphabetical",
  },
  {
    text: "Upper Campus to Lower Campus",
    value: "upperToLower",
  },
  {
    text: "Lower Campus to Upper Campus",
    value: "lowerToUpper",
  },
];
