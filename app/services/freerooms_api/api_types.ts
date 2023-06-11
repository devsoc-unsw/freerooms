export type Building = {
	name: string;
	id: string;
	lat: Number;
	long: Number;
}

export type Buildings = Array<Building>;
type room_status = "free" | "soon" | "busy";

export type Room_Dictionary = { 
	[ buildingID : string ] : {
		[ roomNumber: string ] : {
			status: room_status;
			endtime: string;
		}
	}
};

export type Room = {
	roomNumber : string;
	status: room_status;
	endTime: string;
};

export type Rooms = Array<Room>;
