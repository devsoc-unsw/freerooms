import { BuildingRatingsResponse } from "@common/types";

import { getRoomsByBuilding } from "../src/helpers";
import {
  getAllBuildingRatings,
  getAllRoomRatingsInBuilding,
  getBuildingRatings,
  getRatings,
  insertBuldingRating,
  insertRating,
} from "../src/ratingDbInterface";

jest.mock("../src/config", () => ({
  MONGO_URI: "mongodb://mock-uri",
}));

jest.mock("../src/helpers", () => ({
  getRoomsByBuilding: jest.fn(),
}));

const mockCollection = {
  findOne: jest.fn(),
  find: jest.fn(),
  insertOne: jest.fn(),
  updateOne: jest.fn(),
};

const mockSession = {
  withTransaction: jest.fn(async (fn: () => Promise<void>) => {
    await fn();
  }),
  endSession: jest.fn(),
};

const mockDb = {
  collection: jest.fn(() => mockCollection),
};

const mockClient = {
  connect: jest.fn(),
  close: jest.fn(),
  db: jest.fn(() => mockDb),
  startSession: jest.fn(() => mockSession),
};

jest.mock("mongodb", () => ({
  MongoClient: jest.fn(() => mockClient),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("getRatings", () => {
  it("averages every rating in the room's document", async () => {
    mockCollection.findOne.mockResolvedValueOnce({
      roomId: "K-K17-G11",
      ratings: [
        { cleanliness: 4, location: 5, quietness: 3, overall: 4 },
        { cleanliness: 2, location: 3, quietness: 5, overall: 4 },
      ],
    });

    const result = await getRatings("K-K17-G11");

    expect(mockDb.collection).toHaveBeenCalledWith("ratings");
    expect(result).toEqual({
      roomId: "K-K17-G11",
      overallRating: 4,
      averageRating: { cleanliness: 3, location: 4, quietness: 4 },
    });
    expect(mockClient.close).toHaveBeenCalled();
  });

  it("returns a zeroed response when the room has no ratings document", async () => {
    mockCollection.findOne.mockResolvedValueOnce(null);

    const result = await getRatings("K-NONE-000");

    expect(result).toEqual({
      roomId: "K-NONE-000",
      overallRating: 0,
      averageRating: { cleanliness: 0, location: 0, quietness: 0 },
    });
  });

  it("still closes the client and returns a zeroed response if the query throws", async () => {
    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    mockCollection.findOne.mockRejectedValueOnce(new Error("boom"));

    const result = await getRatings("K-K17-G11");

    expect(result).toEqual({
      roomId: "K-K17-G11",
      overallRating: 0,
      averageRating: { cleanliness: 0, location: 0, quietness: 0 },
    });
    expect(consoleError).toHaveBeenCalledWith(
      "Error finding item:",
      expect.any(Error)
    );
    expect(mockClient.close).toHaveBeenCalled();
  });
});

describe("getBuildingRatings", () => {
  it("returns the building's rating when a document is found", async () => {
    mockCollection.findOne.mockResolvedValueOnce({
      buildingId: "K-G27",
      overallRating: 4.5,
    });

    const result = await getBuildingRatings("K-G27");

    expect(mockDb.collection).toHaveBeenCalledWith("building-ratings");
    expect(result).toEqual({ buildingId: "K-G27", overallRating: 4.5 });
  });

  it("returns null when the building has no rating document", async () => {
    mockCollection.findOne.mockResolvedValueOnce(null);

    const result = await getBuildingRatings("K-UNKNOWN");

    expect(result).toBeNull();
  });
});

describe("getAllBuildingRatings", () => {
  it("returns every building-ratings document", async () => {
    const docs: BuildingRatingsResponse[] = [
      { buildingId: "K-G27", overallRating: 4 },
      { buildingId: "K-K17", overallRating: 3.5 },
    ];
    mockCollection.find.mockReturnValueOnce({
      toArray: jest.fn().mockResolvedValueOnce(docs),
    });

    const result = await getAllBuildingRatings();

    expect(mockDb.collection).toHaveBeenCalledWith("building-ratings");
    expect(result).toEqual(docs);
  });

  it("returns an empty array if the query throws", async () => {
    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    mockCollection.find.mockReturnValueOnce({
      toArray: jest.fn().mockRejectedValueOnce(new Error("boom")),
    });

    const result = await getAllBuildingRatings();

    expect(result).toEqual([]);
    expect(consoleError).toHaveBeenCalledWith(
      "Error finding items:",
      expect.any(Error)
    );
    expect(mockClient.close).toHaveBeenCalled();
  });
});

describe("getAllRoomRatingsInBuilding", () => {
  it("only queries and averages ratings for rooms in that building", async () => {
    (getRoomsByBuilding as jest.Mock).mockResolvedValueOnce({
      rooms: {
        "K-K17-G11": { id: "K-K17-G11" },
        "K-K17-G12": { id: "K-K17-G12" },
      },
    });
    mockCollection.find.mockReturnValueOnce({
      toArray: jest.fn().mockResolvedValueOnce([
        {
          roomId: "K-K17-G11",
          ratings: [{ cleanliness: 4, location: 5, quietness: 3, overall: 4 }],
        },
      ]),
    });

    const result = await getAllRoomRatingsInBuilding("K-K17");

    expect(mockCollection.find).toHaveBeenCalledWith(
      { roomId: { $in: ["K-K17-G11", "K-K17-G12"] } },
      expect.anything()
    );
    expect(result).toEqual([
      {
        roomId: "K-K17-G11",
        overallRating: 4,
        averageRating: { cleanliness: 4, location: 5, quietness: 3 },
      },
    ]);
  });

  it("propagates the error if the building doesn't exist", async () => {
    (getRoomsByBuilding as jest.Mock).mockRejectedValueOnce(
      new Error("Building K-FAKE not found")
    );

    await expect(getAllRoomRatingsInBuilding("K-FAKE")).rejects.toThrow(
      "Building K-FAKE not found"
    );
    // Failure happens before a client is ever created, so nothing to close
    expect(mockClient.close).not.toHaveBeenCalled();
  });
});

describe("insertRating", () => {
  it("upserts a new rating onto the room's ratings array", async () => {
    await insertRating("K-K17-G11", [4, 5, 3, 4]);

    expect(mockDb.collection).toHaveBeenCalledWith("ratings");
    expect(mockCollection.updateOne).toHaveBeenCalledWith(
      { roomId: "K-K17-G11" },
      {
        $push: {
          ratings: { cleanliness: 4, location: 5, quietness: 3, overall: 4 },
        },
      },
      { upsert: true }
    );
    expect(mockClient.close).toHaveBeenCalled();
  });

  it("still closes the client if the update throws", async () => {
    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    mockCollection.updateOne.mockRejectedValueOnce(new Error("boom"));

    await expect(
      insertRating("K-K17-G11", [4, 5, 3, 4])
    ).resolves.toBeUndefined();

    expect(consoleError).toHaveBeenCalledWith(
      "Error inserting document:",
      expect.any(Error)
    );
    expect(mockClient.close).toHaveBeenCalled();
  });
});

describe("insertBuldingRating", () => {
  it("creates a new building-ratings document on the first rating", async () => {
    mockCollection.findOne.mockResolvedValueOnce(null);

    await insertBuldingRating("K-G27", 4);

    expect(mockCollection.insertOne).toHaveBeenCalledWith({
      buildingId: "K-G27",
      overallRating: 4,
      numRating: 1,
    });
  });

  it("recomputes the running average on subsequent ratings", async () => {
    mockCollection.findOne.mockResolvedValueOnce({
      buildingId: "K-G27",
      overallRating: 4,
      numRating: 1,
    });

    await insertBuldingRating("K-G27", 5);

    expect(mockCollection.updateOne).toHaveBeenCalledWith(
      { buildingId: "K-G27" },
      { $set: { overallRating: 4.5, numRating: 2 } },
      { session: mockSession }
    );
  });

  it("rounds the new average to one decimal place", async () => {
    mockCollection.findOne.mockResolvedValueOnce({
      buildingId: "K-G27",
      overallRating: 4,
      numRating: 3,
    });

    await insertBuldingRating("K-G27", 5);

    expect(mockCollection.updateOne).toHaveBeenCalledWith(
      { buildingId: "K-G27" },
      { $set: { overallRating: 4.3, numRating: 4 } },
      { session: mockSession }
    );
  });
});
