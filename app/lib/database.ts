import {
  DocHistory,
  DocReview,
  GitHubCommit,
  SavedDoc,
  UploadedFile,
  User,
} from "./models";
import {
  IDocHistory,
  IDocReview,
  IGitHubCommit,
  ISavedDoc,
  IUploadedFile,
  IUser,
} from "./models/models.types";
import { connectDB } from "./mongoose";

// ==================== TYPE DEFINITIONS ====================

type UserCreateData = {
  username: string;
  email: string;
  password: string;
};

type SavedDocCreateData = {
  userId: string;
  title: string;
  content: string;
  docType: string;
  version?: number;
};

type DocHistoryCreateData = {
  docId: string;
  userId: string;
  title: string;
  documentType: string;
  content: string;
  version: number;
  changeDescription?: string;
};

type GitHubCommitCreateData = {
  userId: string;
  commitSha: string;
  commitMessage: string;
  repoName: string;
  repoOwner: string;
  branchName: string;
  filesPushed: string[];
  commitUrl?: string;
};

type UploadedFileCreateData = {
  userId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
};

type DocReviewCreateData = {
  userId: string;
  docId?: string;
  reviewType: string;
  feedback: string;
  suggestions?: string[];
  rating?: number;
};

// ==================== USER FUNCTIONS ====================

export async function createUser(data: UserCreateData): Promise<IUser> {
  await connectDB();

  const user = await User.create({
    ...data,
    username: data.username.toLowerCase(),
    email: data.email.toLowerCase(),
  });

  return user.toObject();
}

export async function getUserByEmail(email: string): Promise<IUser | null> {
  await connectDB();
  const user = await User.findOne({ email: email.toLowerCase() }).lean();
  return user;
}

export async function getUserByUsername(
  username: string,
): Promise<IUser | null> {
  await connectDB();
  const user = await User.findOne({
    username: username.toLowerCase(),
  }).lean();
  return user;
}

export async function getUserByEmailOrUsername(
  identifier: string,
): Promise<IUser | null> {
  await connectDB();
  const lowerIdentifier = identifier.toLowerCase();

  const user = await User.findOne({
    $or: [{ email: lowerIdentifier }, { username: lowerIdentifier }],
  }).lean();

  return user;
}

export async function getUserById(id: string): Promise<IUser | null> {
  await connectDB();
  try {
    const user = await User.findById(id).lean();
    return user;
  } catch (error) {
    return null;
  }
}

// ==================== DOCUMENT FUNCTIONS ====================

export async function getUserDocs(userId: string) {
  await connectDB();
  return SavedDoc.find({ userId }).sort({ createdAt: -1 }).lean().exec();
}

export async function getDocById(
  docId: string,
  userId: string,
): Promise<ISavedDoc | null> {
  await connectDB();
  try {
    return SavedDoc.findOne({
      _id: docId,
      userId,
    })
      .lean()
      .exec();
  } catch (error) {
    return null;
  }
}

export async function updateDoc(
  docId: string,
  userId: string,
  data: Partial<
    Pick<SavedDocCreateData, "title" | "content" | "docType" | "version">
  >,
): Promise<boolean> {
  await connectDB();
  try {
    const result = await SavedDoc.updateOne(
      {
        _id: docId,
        userId,
      },
      {
        $set: data,
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
  await connectDB();
  try {
    const result = await SavedDoc.deleteOne({
      _id: docId,
      userId,
    });
    return result.deletedCount > 0;
  } catch (error) {
    return false;
  }
}

// ==================== HISTORY FUNCTIONS ====================

export async function deleteDocHistory(
  historyId: string,
  userId: string,
): Promise<boolean> {
  await connectDB();
  try {
    const result = await DocHistory.deleteOne({
      _id: historyId,
      userId,
    });
    return result.deletedCount > 0;
  } catch (error) {
    console.error("Error deleting history entry:", error);
    return false;
  }
}

export async function saveDocHistory(
  data: DocHistoryCreateData,
): Promise<IDocHistory> {
  await connectDB();

  const historyEntry = await DocHistory.create(data);
  return historyEntry.toObject();
}

export async function getHistoryVersion(
  historyId: string,
  userId: string,
): Promise<IDocHistory | null> {
  await connectDB();
  try {
    return DocHistory.findOne({
      _id: historyId,
      userId,
    })
      .lean()
      .exec();
  } catch (error) {
    return null;
  }
}

export async function getUserHistory(
  userId: string,
  page: number = 1,
  limit: number = 20,
) {
  await connectDB();
  const skip = (page - 1) * limit;

  const [history, total] = await Promise.all([
    DocHistory.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec(),
    DocHistory.countDocuments({ userId }),
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

export async function getUserHistoryWithSearch(
  userId: string,
  page: number = 1,
  limit: number = 20,
  searchQuery?: string,
) {
  await connectDB();
  const skip = (page - 1) * limit;

  const query: any = { userId };
  if (searchQuery) {
    query.$or = [
      { title: { $regex: searchQuery, $options: "i" } },
      { documentType: { $regex: searchQuery, $options: "i" } },
    ];
  }

  const [history, total] = await Promise.all([
    DocHistory.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec(),
    DocHistory.countDocuments(query),
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
  data: GitHubCommitCreateData,
): Promise<IGitHubCommit> {
  await connectDB();

  const commit = await GitHubCommit.create(data);
  return commit.toObject();
}

export async function getGitHubCommitsByUser(
  userId: string,
  limit: number = 20,
) {
  await connectDB();
  return GitHubCommit.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean()
    .exec();
}

// ==================== DOCUMENT WITH HISTORY ====================

export async function saveDocumentationWithHistory(
  doc: Omit<SavedDocCreateData, "version">,
): Promise<ISavedDoc> {
  await connectDB();

  const savedDoc = await SavedDoc.create({
    ...doc,
    version: 1,
  });

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

  return savedDoc.toObject();
}

// ==================== FILE UPLOAD FUNCTIONS ====================

export async function saveUploadedFile(
  data: UploadedFileCreateData,
): Promise<IUploadedFile> {
  await connectDB();

  const file = await UploadedFile.create(data);
  return file.toObject();
}

// ==================== DOCUMENT REVIEW FUNCTIONS ====================

export async function saveDocReview(
  data: DocReviewCreateData,
): Promise<IDocReview> {
  await connectDB();

  const review = await DocReview.create(data);
  return review.toObject();
}

export async function getLatestDocReview(
  userId: string,
  docId?: string,
): Promise<IDocReview | null> {
  await connectDB();

  return DocReview.findOne({
    userId,
    ...(docId ? { docId } : {}),
  })
    .sort({ createdAt: -1 })
    .lean()
    .exec();
}
