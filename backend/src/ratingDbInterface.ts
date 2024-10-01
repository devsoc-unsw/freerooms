import { RatingsResponse } from "@common/types";
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

    // Update this room's document with new ratings
    // If no documents exist for the current room, create one with ratings array
    const filter = { roomId: roomId };
    const options = {
      upsert: true,
    };
    const result = await collection.updateOne(
      filter,
      { $push: { ratings: ratings } },
      options
    );

    console.log(result);
  } catch (error) {
    console.error("Error inserting document:", error);
  } finally {
    await client.close();
  }
}

export async function getRatings(roomId: string): Promise<RatingsResponse[]> {
  if (!uri) {
    throw new Error("uri not found");
  }

  const client = new MongoClient(uri);
  // Return object
  const roomRatings: RatingsResponse[] = [];

  try {
    await client.connect();
    const database = client.db("room-ratings");
    const collection = database.collection("ratings");

    const query = { roomId: roomId };
    // Include only 'roomId' and 'ratings' fields in each document
    const options = {
      projection: { _id: 0, roomId: 1, ratings: 1 },
    };

    const room = collection.find(query, options);
    // No document found
    if ((await collection.countDocuments(query)) === 0) {
      return roomRatings;
    }

    for await (const doc of room) {
      // Convert to return type
      const roomRating = doc as unknown as RatingsResponse;
      roomRatings.push(roomRating);
    }
  } catch (error) {
    console.error("Error finding item:", error);
  } finally {
    await client.close();
  }

  return roomRatings;
}
