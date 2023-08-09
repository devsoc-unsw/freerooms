// Contains types shared across BE/FE/App

///////////////////////////////////////////////////////////////
// Data types

export type Building = {
  name: string;
  id: string;
  lat: number;
  long: number;
<<<<<<< HEAD
  aliases: string[];
=======
  // aliases: string[];
>>>>>>> 599e782 (feat: use common folder for shared code (e.g. data types) (#402))
};

export type Room = {
  name: string;
  id: string;
<<<<<<< HEAD
  abbr: string;
  capacity: number;
  usage: string;
  school: string;
=======
  // abbr: string;
  capacity: number;
  usage: string;
  // school: string;
>>>>>>> 599e782 (feat: use common folder for shared code (e.g. data types) (#402))
};

export type Booking = {
  name: string;
<<<<<<< HEAD
  bookingType: string;
=======
  // bookingType: string;
>>>>>>> 599e782 (feat: use common folder for shared code (e.g. data types) (#402))
  start: Date;
  end: Date;
};

export type BuildingStatus = {
  [roomNumber: string]: RoomStatus
}

export type RoomStatus = {
  status: "free" | "soon" | "busy";
  endtime: string;
};

///////////////////////////////////////////////////////////////
// API Response Types

export type BuildingsResponse = {
  buildings: Building[];
}

export type RoomsResponse = {
  rooms: {
    [roomId: string]: Room
  };
}

export type StatusResponse = {
  [buildingId: string]: BuildingStatus
}

export type BookingsResponse = {
  bookings: Booking[];
};
