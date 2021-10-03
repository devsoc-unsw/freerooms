export type RoomStatus = "free" | "soon" | "busy";
export type Room = {
  name: string;
  classEndTime: string;
  status: RoomStatus;
};

export type Campus = "Paddington" | "Kensington";
export type BuildingData = {
  name: string;
  id: string;
  img: string;
};

export type Booking = {
  course_code: string;
  start: string;
  end: string;
};
