import { ObjectId } from "mongodb";

export interface User {
  _id: ObjectId;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  image?: string;
}

export interface GenDocsUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export type FormState = {
  errors?: Partial<Record<"name" | "email" | "password", string[]>>;
  message?: string;
};
