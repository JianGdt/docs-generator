import { ObjectId } from "mongodb";

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

export interface UploadedFile {
  _id?: ObjectId;
  userId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  content: string;
  uploadedAt: Date;
}


