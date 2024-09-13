import {MongoClient} from 'mongodb'

import dotenv from 'dotenv';
dotenv.config({ path: 'src/.env.local' });

const uri: string | undefined = process.env.MONGODB_URI;

export async function insertRating(roomId: string, ratings: number[]): Promise<void> {
    if (!uri) {
        throw new Error('uri not found')
    }

    const client = new MongoClient(uri);
    try {
        await client.connect();
        const database = client.db('room-ratings');
        const collection = database.collection('ratings');

        const document = {
            roomId: roomId,
            ratings: ratings
        };

        await collection.insertOne(document);
    } catch (error) {
        console.error("Error inserting document:", error);
    } finally {
        await client.close();
    }
}
