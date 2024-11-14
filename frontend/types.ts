import { Building, Room } from "@common/types";

///////////////////////////////////////////////////////////////
// Dropdown types

export type DropDown = {
  text: string;
  key: keyof Filters;
  items: DropDownItem[];
};

export type DropDownItem = {
  text: string;
  value: string;
};

///////////////////////////////////////////////////////////////
// Search options for site-wide search

export type SearchOption = (BuildingSearchOption | RoomSearchOption) & {
  recent?: boolean;
};

// First element in searchKeys should always be name
export type BuildingSearchOption = {
  type: "Building";
  searchKeys: string[];
  building: Building;
};

export type RoomSearchOption = {
  type: "Room";
  searchKeys: string[];
  room: Room;
};

///////////////////////////////////////////////////////////////
// Other

// Filters for /rooms endpoint
export type Filters = {
  capacity?: string;
  usage?: string;
  location?: string;
  duration?: string;
  id?: string;
};

export type AllRoomsFilters = {
  capacity?: string[];
  usage?: string[];
  location?: string[];
  duration?: string[];
  buildingId?: string[];
  id?: string[];
};

export type Sponsor = {
  name: string;
  image: string;
  url: string;
};
