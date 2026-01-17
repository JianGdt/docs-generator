import { z } from "zod";

export const commitFileSchema = z.object({
  owner: z.string().min(1, "Owner is required"),
  repo: z.string().min(1, "Repository is required"),
  path: z.string().min(1, "File path is required"),
  content: z.string().min(1, "Content is required"),
  message: z.string().min(1, "Commit message is required"),
  branch: z.string().optional().default("main"),
  docId: z.string().optional(),
});

export const createPullRequestSchema = z.object({
  owner: z.string().min(1, "Owner is required"),
  repo: z.string().min(1, "Repository is required"),
  title: z.string().min(1, "PR title is required"),
  body: z.string().optional(),
  head: z.string().min(1, "Head branch is required"),
  base: z.string().optional().default("main"),
});

export const repositorySchema = z.object({
  owner: z.string().min(1),
  repo: z.string().min(1),
});

export const branchSchema = z.object({
  owner: z.string().min(1),
  repo: z.string().min(1),
  branch: z.string().min(1),
  fromBranch: z.string().optional().default("main"),
});

export const commitSchema = z.object({
  repository: z.string().min(1, "Repository is required"),
  path: z.string().min(1, "File path is required"),
  message: z.string().min(1, "Commit message is required"),
  createPR: z.boolean(),
  prTitle: z.string().optional(),
  prBody: z.string().optional(),
});

export const githubUrlSchema = z
  .string()
  .url("Invalid URL format.")
  .regex(
    /github\.com\/[\w.-]+\/[\w.-]+$/i,
    "Must be a valid GitHub repository URL."
  );

export type GithubUrlInput = z.infer<typeof githubUrlSchema>;
export type CommitFormValues = z.infer<typeof commitSchema>;
export type CommitFileInput = z.infer<typeof commitFileSchema>;
export type CreatePullRequestInput = z.infer<typeof createPullRequestSchema>;
export type RepositoryInput = z.infer<typeof repositorySchema>;
export type BranchInput = z.infer<typeof branchSchema>;
