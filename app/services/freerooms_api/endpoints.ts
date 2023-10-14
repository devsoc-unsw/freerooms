import {
  Building,
  BuildingsResponse,
  RoomsResponse,
  StatusResponse,
} from "@common/types";
import config from "./config";

const domain = config.domain;
export async function getBuildings(): Promise<Building[]> {
  const buildingsEndpoint = config.endpoints.getBuildings;

  const url = `${domain}${buildingsEndpoint}`;

  let buildings: Building[] = [];
  try {
    const response = await fetch(url);
    const data: BuildingsResponse = await response.json();
    buildings = data.buildings;
  } catch {}

  return buildings;
}

export async function getRooms(): Promise<StatusResponse> {
  const roomsEndpoint = config.endpoints.getRooms;
  const url = `${domain}${roomsEndpoint}`;
  let rooms_lookup = {};

  try {
    const response = await fetch(url);
    rooms_lookup = await response.json();
  } catch {}

  return rooms_lookup;
}

export async function getRoomInfo(): Promise<RoomsResponse> {
  const roomInfoEndpoint = config.endpoints.getRoomInfo;
  const url = `${domain}${roomInfoEndpoint}`;
  let room_lookup = { rooms: {} };

  try {
    const response = await fetch(url);
    room_lookup = await response.json();
  } catch {}

  return room_lookup;
}
