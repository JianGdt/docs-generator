import { MongoClient, Db, ObjectId } from "mongodb";
import { ENV } from "./constants";
import { User } from "./@types/user";
import { SavedDoc } from "./@types/docs";
import { DocHistoryEntry } from "./@types/history";

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

export async function updateUser(
  id: string,
  data: Partial<Omit<User, "_id" | "createdAt">>,
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
      },
    );
    return result.modifiedCount > 0;
  } catch (error) {
    return false;
  }
}

// ==================== DOCUMENT FUNCTIONS ====================

export async function saveDocumentation(
  doc: Omit<SavedDoc, "_id" | "createdAt">,
): Promise<SavedDoc> {
  const db = await getDatabase();
  const result = await db.collection<SavedDoc>("docs").insertOne({
    ...doc,
    version: 1, // Initialize version
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

// Get doc history with pagination
export async function getDocHistory(
  docId: string,
  userEmail: string,
  page: number = 1,
  limit: number = 10,
) {
  const db = await getDatabase();
  const skip = (page - 1) * limit;

  const [history, total] = await Promise.all([
    db
      .collection<DocHistoryEntry>("doc_history")
      .find({ docId, userId: userEmail })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray(),
    db
      .collection<DocHistoryEntry>("doc_history")
      .countDocuments({ docId, userId: userEmail }),
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

// Save a history entry when doc is updated
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

// Get specific history version
export async function getHistoryVersion(
  historyId: string,
  userEmail: string,
): Promise<DocHistoryEntry | null> {
  const db = await getDatabase();
  try {
    return db.collection<DocHistoryEntry>("doc_history").findOne({
      _id: new ObjectId(historyId),
      userId: userEmail,
    });
  } catch (error) {
    return null;
  }
}

export async function restoreDocFromHistory(
  docId: string,
  historyId: string,
  userEmail: string,
): Promise<boolean> {
  const db = await getDatabase();

  try {
    const historyEntry = await getHistoryVersion(historyId, userEmail);
    if (!historyEntry || historyEntry.docId !== docId) {
      return false;
    }

    const currentDoc = await getDocById(docId, userEmail);
    if (currentDoc) {
      await saveDocHistory({
        docId,
        userId: userEmail,
        title: currentDoc.title,
        documentType: currentDoc.docType,
        content: currentDoc.content,
        version: (currentDoc.version || 0) + 1,
        changeDescription: "Auto-saved before restore",
      });
    }
    const result = await db.collection<SavedDoc>("docs").updateOne(
      { _id: new ObjectId(docId), userId: userEmail },
      {
        $set: {
          title: historyEntry.title,
          documentType: historyEntry.documentType,
          content: historyEntry.content,
          version: (currentDoc?.version || 0) + 1,
          updatedAt: new Date(),
        },
      },
    );

    return result.modifiedCount > 0;
  } catch (error) {
    return false;
  }
}

export async function getUserHistory(
  userEmail: string,
  page: number = 1,
  limit: number = 20,
) {
  const db = await getDatabase();
  const skip = (page - 1) * limit;

  const [history, total] = await Promise.all([
    db
      .collection<DocHistoryEntry>("doc_history")
      .find({ userId: userEmail })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray(),
    db
      .collection<DocHistoryEntry>("doc_history")
      .countDocuments({ userId: userEmail }),
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

// Delete old history entries (cleanup)
export async function deleteOldHistory(
  docId: string,
  userEmail: string,
  keepVersions: number = 10,
): Promise<number> {
  const db = await getDatabase();

  try {
    const allVersions = await db
      .collection<DocHistoryEntry>("doc_history")
      .find({ docId, userId: userEmail })
      .sort({ createdAt: -1 })
      .toArray();

    if (allVersions.length <= keepVersions) {
      return 0;
    }

    const versionsToDelete = allVersions.slice(keepVersions);
    const idsToDelete = versionsToDelete.map((v) => v._id).filter(Boolean);

    const result = await db
      .collection<DocHistoryEntry>("doc_history")
      .deleteMany({
        _id: { $in: idsToDelete },
      });

    return result.deletedCount;
  } catch (error) {
    return 0;
  }
}

/**
 * Delete all history entries for a specific document
 * This should be called when a document is deleted
 */
export async function deleteDocHistory(
  docId: string,
  userId: string,
): Promise<boolean> {
  const db = await getDatabase();

  try {
    const result = await db
      .collection<DocHistoryEntry>("doc_history")
      .deleteMany({
        docId: docId,
        userId: userId,
      });

    console.log(
      `Deleted ${result.deletedCount} history entries for document ${docId}`,
    );
    return true;
  } catch (error) {
    console.error("Error deleting document history:", error);
    return false;
  }
}

// ==================== GITHUB INTEGRATION FUNCTIONS ====================

export interface GitHubCommit {
  _id?: ObjectId;
  userId: string;
  docId: string;
  repositoryFullName: string;
  filePath: string;
  commitSha: string | any;
  commitMessage: string;
  commitUrl: string | any;
  pullRequestNumber?: number;
  pullRequestUrl?: string;
  createdAt: Date;
}

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

export async function getGitHubCommitsByDoc(docId: string, userId: string) {
  const db = await getDatabase();
  return db
    .collection<GitHubCommit>("github_commits")
    .find({ docId, userId })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function saveDocumentationWithHistory(
  doc: Omit<SavedDoc, "_id" | "createdAt" | "version">,
): Promise<SavedDoc> {
  const db = await getDatabase();

  // Save the document with version 1
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

export interface UploadedFile {
  _id?: ObjectId;
  userId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  content: string;
  uploadedAt: Date;
}

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

export async function getUserUploadedFiles(userId: string, limit: number = 50) {
  const db = await getDatabase();
  return db
    .collection<UploadedFile>("uploaded_files")
    .find({ userId })
    .sort({ uploadedAt: -1 })
    .limit(limit)
    .toArray();
}

export async function getUploadedFileById(
  fileId: string,
  userId: string,
): Promise<UploadedFile | null> {
  const db = await getDatabase();
  try {
    return db.collection<UploadedFile>("uploaded_files").findOne({
      _id: new ObjectId(fileId),
      userId,
    });
  } catch (error) {
    return null;
  }
}

export async function deleteUploadedFile(
  fileId: string,
  userId: string,
): Promise<boolean> {
  const db = await getDatabase();
  try {
    const result = await db
      .collection<UploadedFile>("uploaded_files")
      .deleteOne({
        _id: new ObjectId(fileId),
        userId,
      });
    return result.deletedCount > 0;
  } catch (error) {
    return false;
  }
}
