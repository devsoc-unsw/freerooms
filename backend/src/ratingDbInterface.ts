const {MongoClient} = require('mongodb');
const uri = "mongodb+srv://freerooms:Freerooms123-456@freerooms.bceee3g.mongodb.net/?retryWrites=true&w=majority&appName=freerooms"

export async function insertRating(roomId: string, ratings: number[]): Promise<void> {
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


// export async function fetchAverageExperience(roomName: string): Promise<number> {
//     const client = new MongoClient(uri);
//     try {
//         await client.connect();
//         const database = client.db('room-ratings');
//         const collection = database.collection('ratings');

//         // Find all documents matching the room name
//         const query = { roomName: roomName };
//         const results = await collection.find(query).toArray();

//         return results;
//     } catch (error) {
//         console.error("Error fetching ratings:", error);
//         throw new Error("Failed to fetch ratings");
//     } finally {
//         await client.close();
//     }
// }