import { Building, BuildingsResponse, StatusResponse } from "@common/types";
import config from "./config";

const domain = config.domain;
export async function getBuildings() : Promise<Building[]> {
	
	const buildingsEndpoint = config.endpoints.getBuildings;
	
	const url = `${domain}${buildingsEndpoint}`;
	
	let buildings : Building[] = [];
	try {
		const response = await fetch(url);
		const data : BuildingsResponse = await response.json();
		buildings = data.buildings;
	} catch {}
	
	return buildings;
}

export async function getRooms() : Promise<StatusResponse> {

	const roomsEndpoint = config.endpoints.getRooms;
	const url = `${domain}${roomsEndpoint}`;
	let room_lookup = {};
	
	try {
		const response = await fetch(url);
		room_lookup = await response.json();
	} catch {}
	
	return room_lookup;
}
