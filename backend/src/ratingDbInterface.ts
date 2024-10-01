import { Rating, RatingsResponse } from "@common/types";
import dotenv from "dotenv";
import { Collection, MongoClient } from "mongodb";
dotenv.config({ path: "src/.env.local" });

const uri: string | undefined = process.env.MONGODB_URI;

export async function insertRating(
  roomId: string,
  ratings: number[]
): Promise<void> {
  if (!uri) {
    throw new Error("uri not found");
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const database = client.db("room-ratings");
    const collection: Collection<RatingsResponse> =
      database.collection("ratings");

    const ratingObject: Rating = {
      quitness: ratings[0],
      location: ratings[1],
      cleanliness: ratings[2],
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

export async function getRatings(roomId: string): Promise<Rating[]> {
  if (!uri) {
    throw new Error("uri not found");
  }

  const client = new MongoClient(uri);

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
      const roomRating = roomDoc as unknown as RatingsResponse;
      return roomRating.ratings;
    }
  } catch (error) {
    console.error("Error finding item:", error);
  } finally {
    await client.close();
  }
  // No document found, return empty array
  return [];
}
