import { MongoClient, Db, ObjectId } from "mongodb";
import { SavedDoc, User } from "./types";
import { ENV } from "./constants";

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(ENV.MONGODB_URI!);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(ENV.MONGODB_URI!);
  clientPromise = client.connect();
}

export async function getDatabase(): Promise<Db> {
  const client = await clientPromise;
  return client.db("ai-docs-generator");
}

export async function createUser(data: {
  username: string;
  email: string;
  password: string;
}): Promise<User> {
  const db = await getDatabase();
  const now = new Date();

  const result = await db.collection<User>("users").insertOne({
    ...data,
    createdAt: now,
  } as User);

  const user = await db
    .collection<User>("users")
    .findOne({ _id: result.insertedId });
  if (!user) {
    throw new Error("Failed to create user");
  }

  return user;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const db = await getDatabase();
  return db.collection<User>("users").findOne({ email: email.toLowerCase() });
}

export async function getUserByUsername(username: string): Promise<User | null> {
  const db = await getDatabase();
  return db.collection<User>("users").findOne({ username: username.toLowerCase() });
}

export async function getUserByEmailOrUsername(identifier: string): Promise<User | null> {
  const db = await getDatabase();
  const lowerIdentifier = identifier.toLowerCase();
  
  return db.collection<User>("users").findOne({
    $or: [
      { email: lowerIdentifier },
      { username: lowerIdentifier }
    ]
  });
}

export async function getUserById(id: string): Promise<User | null> {
  const db = await getDatabase();
  try {
    return db.collection<User>("users").findOne({ _id: new ObjectId(id) });
  } catch (error) {
    return null;
  }
}

export async function updateUser(
  id: string,
  data: Partial<Omit<User, "_id" | "createdAt">>
): Promise<boolean> {
  const db = await getDatabase();
  try {
    const result = await db.collection<User>("users").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...data,
          updatedAt: new Date(),
        },
      }
    );
    return result.modifiedCount > 0;
  } catch (error) {
    return false;
  }
}

export async function saveDocumentation(
  doc: Omit<SavedDoc, "_id" | "createdAt">
): Promise<SavedDoc> {
  const db = await getDatabase();
  const result = await db.collection<SavedDoc>("docs").insertOne({
    ...doc,
    createdAt: new Date(),
  } as SavedDoc);

  const savedDoc = await db.collection<SavedDoc>("docs").findOne({
    _id: result.insertedId,
  });

  if (!savedDoc) {
    throw new Error("Failed to save documentation");
  }

  return savedDoc;
}

export async function getRecentDocs(userId: string, limit: number = 10) {
  const db = await getDatabase();
  return db
    .collection<SavedDoc>("docs")
    .find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
}

export async function getUserDocs(userId: string) {
  const db = await getDatabase();
  return db
    .collection<SavedDoc>("docs")
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function getDocById(
  docId: string,
  userId: string
): Promise<SavedDoc | null> {
  const db = await getDatabase();
  try {
    return db.collection<SavedDoc>("docs").findOne({
      _id: new ObjectId(docId),
      userId,
    });
  } catch (error) {
    return null;
  }
}

export async function updateDoc(
  docId: string,
  userId: string,
  data: Partial<Omit<SavedDoc, "_id" | "createdAt" | "userId">>
): Promise<boolean> {
  const db = await getDatabase();
  try {
    const result = await db.collection<SavedDoc>("docs").updateOne(
      {
        _id: new ObjectId(docId),
        userId,
      },
      {
        $set: {
          ...data,
          updatedAt: new Date(),
        },
      }
    );
    return result.modifiedCount > 0;
  } catch (error) {
    return false;
  }
}

export async function deleteDoc(
  docId: string,
  userId: string
): Promise<boolean> {
  const db = await getDatabase();
  try {
    const result = await db.collection<SavedDoc>("docs").deleteOne({
      _id: new ObjectId(docId),
      userId,
    });
    return result.deletedCount > 0;
  } catch (error) {
    return false;
  }
}