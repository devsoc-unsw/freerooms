import { getNearbyRooms } from "@frontend/utils/nearbyRooms";
import type { Building, Room, RoomStatus, StatusResponse } from "common/types";

const makeBuilding = (id: string, lat: number, long: number): Building => ({
  id,
  name: id,
  lat,
  long,
  aliases: [],
});

const makeRoom = (id: string, name: string): Room => ({
  id,
  name,
  abbr: name,
  capacity: 30,
  usage: "LEC",
  school: " ",
});

const buildings = [
  makeBuilding("K-F17", -33.917, 151.231),
  makeBuilding("K-F18", -33.918, 151.231),
  makeBuilding("K-G27", -33.921, 151.235),
];

const rooms = {
  "K-F17-101": makeRoom("K-F17-101", "Current Room"),
  "K-F17-102": makeRoom("K-F17-102", "Room B"),
  "K-F17-103": makeRoom("K-F17-103", "Room A"),
  "K-F17-104": makeRoom("K-F17-104", "Busy Room"),
  "K-F17-105": makeRoom("K-F17-105", "Available Soon"),
  "K-F17-106": makeRoom("K-F17-106", "Unknown Status"),
  "K-F18-101": makeRoom("K-F18-101", "Nearby Room"),
  "K-G27-101": makeRoom("K-G27-101", "Distant Room"),
  "K-X99-101": makeRoom("K-X99-101", "Unknown Building"),
};

const free: RoomStatus = {
  status: "free",
  endtime: "",
};

const statuses: StatusResponse = {
  "K-F17": {
    numAvailable: 3,
    roomStatuses: {
      "101": free,
      "102": free,
      "103": free,
      "104": { status: "busy", endtime: "" },
      "105": { status: "soon", endtime: "" },
    },
  },
  "K-F18": {
    numAvailable: 1,
    roomStatuses: {
      "101": free,
    },
  },
  "K-G27": {
    numAvailable: 1,
    roomStatuses: {
      "101": free,
    },
  },
  "K-X99": {
    numAvailable: 1,
    roomStatuses: {
      "101": free,
    },
  },
};

const findNearbyRooms = (limit?: number) =>
  getNearbyRooms("K-F17-101", rooms, buildings, statuses, limit);

describe("getNearbyRooms", () => {
  it("excludes the current room", () => {
    expect(findNearbyRooms().map(({ room }) => room.id)).not.toContain(
      "K-F17-101"
    );
  });

  it("only includes currently available rooms", () => {
    expect(
      findNearbyRooms().every(({ status }) => status.status === "free")
    ).toBe(true);

    expect(findNearbyRooms()).toHaveLength(4);
  });

  it("excludes rooms with missing availability or building data", () => {
    const ids = findNearbyRooms().map(({ room }) => room.id);

    expect(ids).not.toContain("K-F17-106");
    expect(ids).not.toContain("K-X99-101");
  });

  it("prioritises rooms in the current building", () => {
    const result = findNearbyRooms();

    expect(result[0].distance).toBe(0);
    expect(result[1].distance).toBe(0);
    expect(result[2].distance).toBeGreaterThan(0);
  });

  it("sorts rooms by distance and then name", () => {
    expect(findNearbyRooms().map(({ room }) => room.id)).toEqual([
      "K-F17-103",
      "K-F17-102",
      "K-F18-101",
      "K-G27-101",
    ]);
  });

  it("limits the number of returned rooms", () => {
    expect(findNearbyRooms(2)).toHaveLength(2);
  });

  it("returns no rooms if the current building is unknown", () => {
    expect(getNearbyRooms("K-X99-101", rooms, buildings, statuses)).toEqual([]);
  });

  it("returns no rooms when availability is missing", () => {
    expect(getNearbyRooms("K-F17-101", rooms, buildings, {})).toEqual([]);
  });

  it("preserves room, building and availability information", () => {
    expect(findNearbyRooms()[0]).toEqual({
      room: rooms["K-F17-103"],
      building: buildings[0],
      status: free,
      distance: 0,
    });
  });
});
