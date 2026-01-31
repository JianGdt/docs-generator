import { Document } from "mongoose";

// ALL MODELS TYPE SCHEMA HERE

// ==================== USER TYPES ====================

export type UserData = {
  username: string;
  email: string;
  password: string;
};

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== SAVED DOC TYPES ====================

export type SavedDocData = {
  userId: string;
  title: string;
  content: string;
  docType: string;
  version?: number;
};

export interface ISavedDoc extends Document {
  userId: string;
  title: string;
  content: string;
  docType: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== DOC HISTORY TYPES ====================

export type DocHistoryData = {
  docId: string;
  userId: string;
  title: string;
  documentType: string;
  content: string;
  version: number;
  changeDescription?: string;
};

export interface IDocHistory extends Document {
  docId: string;
  userId: string;
  title: string;
  documentType: string;
  content: string;
  version: number;
  changeDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== GITHUB COMMIT TYPES ====================

export type GitHubCommitData = {
  userId: string;
  commitSha: string;
  commitMessage: string;
  repoName: string;
  repoOwner: string;
  branchName: string;
  filesPushed: string[];
  commitUrl?: string;
};

export interface IGitHubCommit extends Document {
  userId: string;
  commitSha: string;
  commitMessage: string;
  repoName: string;
  repoOwner: string;
  branchName: string;
  filesPushed: string[];
  commitUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== UPLOADED FILE TYPES ====================

export type UploadedFileData = {
  userId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  content: string;
};

export interface IUploadedFile extends Document {
  userId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== DOC REVIEW TYPES ====================

export type DocReviewData = {
  userId: string;
  docId?: string;
  reviewType: string;
  feedback: string;
  suggestions?: string[];
  rating?: number;
};

export interface IDocReview extends Document {
  userId: string;
  docId?: string;
  reviewType: string;
  feedback: string;
  suggestions?: string[];
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
}
