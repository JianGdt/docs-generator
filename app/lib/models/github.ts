import mongoose, { Schema, Document } from "mongoose";
import { IGitHubCommit } from "./models.types";


const GitHubCommitSchema = new Schema<IGitHubCommit>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    commitSha: {
      type: String,
      required: true,
    },
    commitMessage: {
      type: String,
      required: true,
    },
    repoName: {
      type: String,
      required: true,
    },
    repoOwner: {
      type: String,
      required: true,
    },
    branchName: {
      type: String,
      required: true,
    },
    filesPushed: [
      {
        type: String,
      },
    ],
    commitUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

GitHubCommitSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.GitHubCommit ||
  mongoose.model<IGitHubCommit>(
    "GitHubCommit",
    GitHubCommitSchema,
    "github_commits",
  );
