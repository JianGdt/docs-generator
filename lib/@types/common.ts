import { ObjectId } from "mongodb";
import { ReactNode } from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";

export type DocType =
  | "readme"
  | "api"
  | "guide"
  | "contributing"
  | "architecture";

export type InputMethod = "github" | "code" | "upload";

export interface BaseDocument {
  _id?: ObjectId;
  createdAt: Date;
  updatedAt?: Date;
}

export interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  name?: string;
}

export interface FormFieldWrapperProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  description?: string;
  children: (field: any) => ReactNode;
}

export interface RepoContext {
  owner: string;
  repoName: string;
  name: string;
  description: string;
  language: string;
  packageJson?: any;
  techStack?: any;
  fileStructure: string[];
  files: Array<{ path: string; content: string }>;
}

export interface ReviewResult {
  score: number;
  summary: string;
  missingSections: string[];
  outdatedWarnings: string[];
  improvements: string[];
  positives: string[];
}

export interface RetryOptions {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
}
