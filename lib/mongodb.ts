import { MongoClient, Db } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("Missing MONGODB_URI in .env.local");
}
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "test";

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let client: MongoClient;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, {
  });
  global._mongoClientPromise = client.connect();
}
const clientPromise = global._mongoClientPromise;

export async function getClient(): Promise<MongoClient> {
  return clientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db(dbName);
}
