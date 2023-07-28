import type { Book_Dictionary, Buildings, Room_Dictionary } from "./api_types";
import config from "./config";

const domain = config.domain;
export async function getBuildings() : Promise<Buildings> {
	
	const buildingsEndpoint = config.endpoints.getBuildings;
	
	const url = `${domain}${buildingsEndpoint}`;
	
	let buildings : Buildings = [];
	try {
		const response = await fetch(url);
		const data : { buildings : Buildings } = await response.json();
		buildings = data.buildings;
	} catch {}
	
	return buildings;
}

export async function getRooms() : Promise<Room_Dictionary> {

	const roomsEndpoint = config.endpoints.getRooms;
	const url = `${domain}${roomsEndpoint}`;
	let room_lookup = {};
	
	try {
		const response = await fetch(url);
		room_lookup = await response.json();
	} catch {}
	
	return room_lookup;
}

export async function getBookings(roomId: string) : Promise<Book_Dictionary> {
	const bookingsEndpoint = config.endpoints.getBookings;
	const url = `${domain}${bookingsEndpoint}/${roomId}`;
	let bookings:Book_Dictionary = {
		name: "",
		bookingType: "",
		start: "",
		end: ""
	};
	try {
		const response = await fetch(url);
		bookings = await response.json();
		
	} catch {}
	return bookings;
}