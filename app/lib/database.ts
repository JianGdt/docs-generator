import { MongoClient, Db, ObjectId } from "mongodb";
import { ENV } from "./constants";
import { User } from "./@types/user";
import { SavedDoc } from "./@types/docs";
import { DocHistoryEntry } from "./@types/history";
import { GitHubCommit, UploadedFile } from "./@types/database";
import { DocReview, DocReviewInsert } from "./@types/review";

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

// ==================== USER FUNCTIONS ====================

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

export async function getUserByUsername(
  username: string,
): Promise<User | null> {
  const db = await getDatabase();
  return db
    .collection<User>("users")
    .findOne({ username: username.toLowerCase() });
}

export async function getUserByEmailOrUsername(
  identifier: string,
): Promise<User | null> {
  const db = await getDatabase();
  const lowerIdentifier = identifier.toLowerCase();

  return db.collection<User>("users").findOne({
    $or: [{ email: lowerIdentifier }, { username: lowerIdentifier }],
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

// ==================== DOCUMENT FUNCTIONS ====================

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
  userId: string,
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
  data: Partial<Omit<SavedDoc, "_id" | "createdAt" | "userId">>,
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
      },
    );
    return result.modifiedCount > 0;
  } catch (error) {
    return false;
  }
}

// documents/[docId]/route.ts

export async function deleteDoc(
  docId: string,
  userId: string,
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

// history/[historyId]/route.ts

export async function deleteDocHistory(
  historyId: string,
  userId: string,
): Promise<boolean> {
  const db = await getDatabase();
  try {
    const result = await db
      .collection<DocHistoryEntry>("doc_history")
      .deleteOne({
        _id: new ObjectId(historyId),
        userId,
      });
    return result.deletedCount > 0;
  } catch (error) {
    console.error("Error deleting history entry:", error);
    return false;
  }
}

export async function saveDocHistory(
  data: Omit<DocHistoryEntry, "_id" | "createdAt">,
): Promise<DocHistoryEntry> {
  const db = await getDatabase();

  const result = await db.collection<DocHistoryEntry>("doc_history").insertOne({
    ...data,
    createdAt: new Date(),
  } as DocHistoryEntry);

  const historyEntry = await db
    .collection<DocHistoryEntry>("doc_history")
    .findOne({ _id: result.insertedId });

  if (!historyEntry) {
    throw new Error("Failed to save doc history");
  }

  return historyEntry;
}

export async function getHistoryVersion(
  historyId: string,
  userId: string,
): Promise<DocHistoryEntry | null> {
  const db = await getDatabase();
  try {
    return db.collection<DocHistoryEntry>("doc_history").findOne({
      _id: new ObjectId(historyId),
      userId,
    });
  } catch (error) {
    return null;
  }
}

export async function getUserHistory(
  userId: string,
  page: number = 1,
  limit: number = 20,
) {
  const db = await getDatabase();
  const skip = (page - 1) * limit;

  const [history, total] = await Promise.all([
    db
      .collection<DocHistoryEntry>("doc_history")
      .find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray(),
    db.collection<DocHistoryEntry>("doc_history").countDocuments({ userId }),
  ]);

  return {
    history,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

// ==================== GITHUB INTEGRATION FUNCTIONS ====================

export async function saveGitHubCommit(
  data: Omit<GitHubCommit, "_id" | "createdAt">,
): Promise<GitHubCommit> {
  const db = await getDatabase();
  const result = await db.collection<GitHubCommit>("github_commits").insertOne({
    ...data,
    createdAt: new Date(),
  } as GitHubCommit);

  const commit = await db.collection<GitHubCommit>("github_commits").findOne({
    _id: result.insertedId,
  });

  if (!commit) {
    throw new Error("Failed to save GitHub commit");
  }

  return commit;
}

export async function getGitHubCommitsByUser(
  userId: string,
  limit: number = 20,
) {
  const db = await getDatabase();
  return db
    .collection<GitHubCommit>("github_commits")
    .find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
}

export async function saveDocumentationWithHistory(
  doc: Omit<SavedDoc, "_id" | "createdAt" | "version">,
): Promise<SavedDoc> {
  const db = await getDatabase();
  const docToSave = {
    ...doc,
    version: 1,
    createdAt: new Date(),
  } as SavedDoc;

  const result = await db.collection<SavedDoc>("docs").insertOne(docToSave);

  const savedDoc = await db.collection<SavedDoc>("docs").findOne({
    _id: result.insertedId,
  });

  if (!savedDoc) {
    throw new Error("Failed to save documentation");
  }

  try {
    await saveDocHistory({
      docId: savedDoc._id!.toString(),
      userId: doc.userId,
      title: doc.title,
      documentType: doc.docType,
      content: doc.content,
      version: 1,
      changeDescription: "Initial version",
    });
  } catch (error) {
    console.error("Failed to save initial history:", error);
  }

  return savedDoc;
}

// ==================== FILE UPLOAD FUNCTIONS ====================

export async function saveUploadedFile(
  data: Omit<UploadedFile, "_id" | "uploadedAt">,
): Promise<UploadedFile> {
  const db = await getDatabase();
  const result = await db.collection<UploadedFile>("uploaded_files").insertOne({
    ...data,
    uploadedAt: new Date(),
  } as UploadedFile);

  const file = await db
    .collection<UploadedFile>("uploaded_files")
    .findOne({ _id: result.insertedId });

  if (!file) {
    throw new Error("Failed to save uploaded file");
  }

  return file;
}

export async function getUserHistoryWithSearch(
  userId: string,
  page: number = 1,
  limit: number = 20,
  searchQuery?: string,
) {
  const db = await getDatabase();
  const skip = (page - 1) * limit;

  const query: any = { userId };
  if (searchQuery) {
    query.$or = [
      { title: { $regex: searchQuery, $options: "i" } },
      { documentType: { $regex: searchQuery, $options: "i" } },
    ];
  }

  const [history, total] = await Promise.all([
    db
      .collection<DocHistoryEntry>("doc_history")
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray(),
    db.collection<DocHistoryEntry>("doc_history").countDocuments(query),
  ]);

  return {
    history,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

// DOCUMENT REVIEW FUNC

export async function saveDocReview(data: DocReviewInsert): Promise<DocReview> {
  const db = await getDatabase();

  const review: DocReview = {
    _id: new ObjectId().toString(),
    ...data,
    createdAt: new Date().toISOString(),
  };

  await db.collection("doc_reviews").insertOne({
    ...review,
    _id: new ObjectId(review._id),
  });

  return review;
}

export async function getLatestDocReview(
  userId: string,
  docId?: string,
): Promise<DocReview | null> {
  const db = await getDatabase();

  return db.collection<DocReview>("doc_reviews").findOne(
    {
      userId,
      ...(docId ? { docId } : {}),
    },
    {
      sort: { createdAt: -1 },
    },
  );
}
