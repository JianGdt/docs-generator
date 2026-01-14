import { ObjectId } from "mongodb";

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
  name: string;
  description: string;
  language: string;
  stars: number;
  files: GitHubFile[];
}

export interface GitHubFile {
  path: string;
  content: string;
}

export interface SavedDoc {
  _id: ObjectId;
  title: string;
  content: string;
  docType: 'readme' | 'api' | 'guide' | 'contributing';
  userId: string;
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
