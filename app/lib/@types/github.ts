import { Session } from "next-auth";
import { RepoContext } from "./common";

export interface GitHubIntegrationProps {
  documentContent: string;
  documentType: string;
  session: Session;
}

export interface GitHubFile {
  path: string;
  content: string;
}

export interface GitHubTechStack {
  framework: string[];
  ui: string[];
  auth: string[];
  database: string[];
  api: string[];
  other: string[];
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
  packageJson?: unknown;
  techStack?: GitHubTechStack;
}

export interface Repository {
  id: number;
  name: string;
  fullName: string;
  owner: string;
  defaultBranch: string;
}

export interface EnhancedGitHubRepo extends RepoContext {
  owner: string;
  repoName: string;
  stars: number;
  fileStructure: string[];
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
