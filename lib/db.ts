import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "portfolio";

declare global { var _mongoClientPromise: Promise<MongoClient> | undefined; }

export async function getDb(): Promise<Db> {
  if (!uri) throw new Error("Missing MONGODB_URI. Copy .env.example to .env.local and configure MongoDB.");
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  return (await global._mongoClientPromise).db(dbName);
}
