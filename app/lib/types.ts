import { ObjectId } from "mongodb";
import type { Session } from "next-auth";

export type DocType = "readme" | "api" | "guide" | "contributing";
export type InputMethod = "github" | "code" | "upload";

export interface GenerateRequest {
  method: InputMethod;
  data: string;
  docType: DocType;
}

export interface GenerateResponse {
  success: boolean;
  documentation?: string;
  error?: string;
}

export interface GitHubRepo {
  owner?: string;
  repoName?: string;
  name: string;
  description: string;
  language: string;
  stars: number;
  files: GitHubFile[];
  fileStructure?: string[];
  packageJson?: any;
  techStack?: {
    framework: string[];
    ui: string[];
    auth: string[];
    database: string[];
    api: string[];
    other: string[];
  };
}

export interface GitHubFile {
  path: string;
  content: string;
}

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

export interface DocsState {
  inputMethod: InputMethod;
  docType: DocType;
  githubUrl: string;
  codeInput: string;
  generatedDocs: string;
  isGenerating: boolean;
  error: string | null;

  setInputMethod: (method: InputMethod) => void;
  setDocType: (type: DocType) => void;
  setGithubUrl: (url: string) => void;
  setCodeInput: (code: string) => void;
  setGeneratedDocs: (docs: string) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

// gen-docs types

export interface GenDocsUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export interface DocsGeneratorProps {
  user: GenDocsUser;
  session: Session;
}

// components types
export interface StatsDisplayProps {
  docs: string;
}

// user types

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

export type FormState = {
  errors?: Partial<Record<"name" | "email" | "password", string[]>>;
  message?: string;
};

// GITHUB CONNECTION TYPES (temporary file or folder structure)

export interface Repository {
  id: number;
  name: string;
  fullName: string;
  owner: string;
  defaultBranch: string;
}

// ==================== HISTORY TYPES ====================

export interface DocHistoryEntry {
  _id?: ObjectId;
  docId: string;
  userId: string;
  title: string;
  documentType: string;
  content: string;
  version: number;
  changeDescription?: string;
  createdAt: Date;
}

export interface HistoryResponse {
  history: DocHistoryEntry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface RestoreHistoryRequest {
  historyId: string;
}

export interface CleanupHistoryRequest {
  keepVersions?: number;
}

export interface UpdateDocRequest {
  title?: string;
  documentType?: string;
  content?: string;
  changeDescription?: string;
}
