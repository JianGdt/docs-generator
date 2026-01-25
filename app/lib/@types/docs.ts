import { ObjectId } from "mongodb";
import { DocType } from "./common";

export interface SavedDoc {
  _id?: ObjectId;
  userId: string;
  title: string;
  content: string;
  docType: DocType;
  repositoryUrl?: string;
  repositoryName?: string;
  version?: number;
  createdAt: Date;
  updatedAt?: Date;
}
