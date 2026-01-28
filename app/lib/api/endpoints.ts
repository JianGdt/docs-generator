import { Repository } from "../@types/github";
import { DocReview } from "../@types/review";
import { UploadedFileData } from "../@types/store";
import { api } from "./client";

export const endpoints = {
  // Auth
  register: (data: { username: string; email: string; password: string }) =>
    api.post<{ message: string }>("/api/register", data),

  // Docs
  generateDocs: (data: { method: string; data: string; docType: string }) =>
    api.post<{
      success: boolean;
      documentation: string;
      metadata?: {
        name?: string;
        url?: string;
      };
    }>("/api/generate", data),

  saveDocs: (data: {
    title: string;
    content: string;
    docType: string;
    repositoryUrl?: string;
    repositoryName?: string;
  }) => api.post<{ success: boolean; id: string }>("/api/docs", data),

  reviewDocs: (data: { data: string }) =>
    api.post<{
      success: boolean;
      data: { review: DocReview };
    }>("/api/review", data),

  // Upload - Fixed to match UploadedFileData type
  uploadFiles: (formData: FormData) =>
    api.post<{
      success: boolean;
      files: UploadedFileData[];
    }>("/api/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  getRepositories: () =>
    api.get<{
      repositories: Repository[];
    }>("/api/github/repositories"),

  createCommit: (data: {
    owner: string;
    repo: string;
    path: string;
    content: string;
    message: string;
    branch: string;
  }) => api.post<{ sha: string; commit: any }>("/api/github/commit", data),

  createPullRequest: (data: {
    owner: string;
    repo: string;
    path: string;
    content: string;
    message: string;
    title: string;
    body: string;
    base: string;
    head: string;
  }) =>
    api.post<{ pullRequest: { number: number } }>(
      "/api/github/pull-request",
      data,
    ),

  deleteHistory: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/api/history/${id}`),
};
