// Contains types shared across BE/FE/App

///////////////////////////////////////////////////////////////
// Data types

export type Building = {
  name: string;
  id: string;
  lat: number;
  long: number;
<<<<<<< HEAD
<<<<<<< HEAD
  aliases: string[];
=======
  // aliases: string[];
>>>>>>> 599e782 (feat: use common folder for shared code (e.g. data types) (#402))
=======
  aliases: string[];
>>>>>>> 58b6c91 (feat: integrate with CSESoc GraphQL API (#403))
};

export type Room = {
  name: string;
  id: string;
<<<<<<< HEAD
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
=======
  abbr: string;
  capacity: number;
  usage: string;
  school: string;
>>>>>>> 58b6c91 (feat: integrate with CSESoc GraphQL API (#403))
};

export type Booking = {
  name: string;
<<<<<<< HEAD
<<<<<<< HEAD
  bookingType: string;
=======
  // bookingType: string;
>>>>>>> 599e782 (feat: use common folder for shared code (e.g. data types) (#402))
=======
  bookingType: string;
>>>>>>> 58b6c91 (feat: integrate with CSESoc GraphQL API (#403))
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
