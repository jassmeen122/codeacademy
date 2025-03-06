
// MongoDB client configuration
import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = "learning_platform";

// Create a MongoDB client
let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient>;

// In development mode, use a global variable so that the value
// is preserved across module reloads caused by HMR (Hot Module Replacement).
if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof global & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(MONGODB_URI);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise
export const mongoClient = clientPromise;

// Helper function to get the database
export async function getDatabase() {
  const client = await clientPromise;
  return client.db(DB_NAME);
}

// Helper function to get a collection
export async function getCollection(collectionName: string) {
  const db = await getDatabase();
  return db.collection(collectionName);
}
