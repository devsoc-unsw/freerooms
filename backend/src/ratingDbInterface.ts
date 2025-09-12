import {
  AverageRating,
  BuildingRatingsResponse,
  Rating,
  RatingsResponse,
  RawRatingDocument,
} from "@common/types";
import dotenv from "dotenv";
import { Collection, MongoClient } from "mongodb";

import { MONGO_URI } from "./config";
dotenv.config({ path: "src/.env.local" });
export async function insertRating(
  roomId: string,
  ratings: number[]
): Promise<void> {
  if (!MONGO_URI) {
    throw new Error("MONGO_URI not found");
  }

  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    const database = client.db("room-ratings");
    const collection: Collection<RatingsResponse> =
      database.collection("ratings");

    const ratingObject: Rating = {
      cleanliness: ratings[0],
      location: ratings[1],
      quietness: ratings[2],
      overall: ratings[3],
    };

    // Update this room's document with new ratings
    // If no documents exist for the current room, create one with ratings array
    const filter = { roomId: roomId };
    const options = {
      upsert: true,
    };
    await collection.updateOne(
      filter,
      { $push: { ratings: ratingObject } },
      options
    );
  } catch (error) {
    console.error("Error inserting document:", error);
  } finally {
    await client.close();
  }
}

export async function insertBuldingRating(
  buildingId: string,
  overallRating: number
): Promise<void> {
  if (!MONGO_URI) {
    throw new Error("MONGO_URI not found");
  }

  const client = new MongoClient(MONGO_URI);
  await client.connect();
  const database = client.db("room-ratings");
  const session = client.startSession();

  try {
    // Start a transaction and run the function to update the building ratings collection
    await session.withTransaction(async () => {
      const collection = database.collection("building-ratings");

      const filter = { buildingId: buildingId };
      const room = await collection.findOne(filter);
      // RoomId is not in db yet, add new document
      if (!room) {
        await collection.insertOne({
          buildingId: buildingId,
          overallRating: overallRating,
          numRating: 1,
        });
      }
      // Update overall rating
      else {
        const newNumRating = room.numRating + 1;

        let newOverallRating =
          (room.overallRating * room.numRating + overallRating) / newNumRating;

        newOverallRating = Math.round(newOverallRating * 10) / 10;

        await collection.updateOne(
          filter,
          {
            $set: { overallRating: newOverallRating, numRating: newNumRating },
          },
          { session }
        );
      }
    });
  } catch (error) {
    console.error("Error inserting document:", error);
  } finally {
    session.endSession();
    await client.close();
  }
}

export async function getRatings(roomId: string): Promise<RatingsResponse> {
  if (!MONGO_URI) {
    throw new Error("MONGO_URI not found");
  }

  const client = new MongoClient(MONGO_URI);

  const averagedRatings: AverageRating = {
    cleanliness: 0,
    location: 0,
    quietness: 0,
  };

  try {
    await client.connect();
    const database = client.db("room-ratings");
    const collection = database.collection("ratings");
    const query = { roomId: roomId };

    // Include only 'roomId' and 'ratings' fields in each document
    const options = {
      projection: { _id: 0, roomId: 1, ratings: 1 },
    };

    const roomDoc = await collection.findOne(query, options);

    // Document found, return ratings array
    if (roomDoc !== null) {
      const foundDoc = roomDoc as unknown as RawRatingDocument;
      foundDoc.ratings.map((doc: Rating) => {
        averagedRatings.cleanliness += doc.cleanliness;
        averagedRatings.location += doc.location;
        averagedRatings.quietness += doc.quietness;
      });

      const numFound = foundDoc.ratings.length;
      if (foundDoc.ratings.length > 0) {
        averagedRatings.cleanliness /= numFound;
        averagedRatings.location /= numFound;
        averagedRatings.quietness /= numFound;
      }

      const res = {
        roomId: foundDoc.roomId,
        overallRating: foundDoc.overallRating,
        averageRating: averagedRatings,
      };

      return res;
    }
  } catch (error) {
    console.error("Error finding item:", error);
  } finally {
    await client.close();
  }
  // No document found, return empty object
  return { roomId: roomId, overallRating: 0, averageRating: averagedRatings };
}

export async function getBuildingRatings(
  buildingId: string
): Promise<BuildingRatingsResponse | null> {
  if (!MONGO_URI) {
    throw new Error("MONGO_URI not found");
  }
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    const database = client.db("room-ratings");
    const collection = database.collection("building-ratings");
    const query = { buildingId: buildingId };

    // Include only 'buildingId' and 'overallRating' fields in each document
    const options = {
      projection: { _id: 0, buildingId: 1, overallRating: 1 },
    };

    const buildingDoc = await collection.findOne(query, options);

    // Document found, return overall rating
    if (buildingDoc !== null) {
      const buildingRating = buildingDoc as unknown as BuildingRatingsResponse;
      return buildingRating;
    }
  } catch (error) {
    console.error("Error finding item:", error);
  } finally {
    await client.close();
  }
  // No document found, return 0
  return null;
}
