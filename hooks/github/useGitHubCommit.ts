// hooks/useGitHubCommit.ts
import { useState } from "react";
import { CommitFormValues } from "@/lib/schema/github";
import { Repository } from "@//lib/@types/github";
import { endpoints } from "@//lib/api/endpoints";

export function useGitHubCommit() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const commit = async (
    values: CommitFormValues,
    content: string,
    repositories: Repository[],
  ) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const selectedRepo = repositories.find(
        (r) => r.fullName === values.repository,
      );

      if (!selectedRepo) {
        throw new Error("Repository not found");
      }

      if (values.createPR) {
        const branchName = `docs/${Date.now()}`;
        const response = await endpoints.createPullRequest({
          owner: selectedRepo.owner,
          repo: selectedRepo.name,
          path: values.path,
          content,
          message: values.message,
          title: values.prTitle || values.message,
          body: values.prBody || `Auto-generated documentation update`,
          base: selectedRepo.defaultBranch,
          head: branchName,
        });

        if (!response.success || !response.data) {
          throw new Error(response.error?.message || "Failed to create PR");
        }

        setSuccess(
          `Pull request created successfully! PR #${response.data.pullRequest.number}`,
        );
      } else {
        const response = await endpoints.createCommit({
          owner: selectedRepo.owner,
          repo: selectedRepo.name,
          path: values.path,
          content,
          message: values.message,
          branch: selectedRepo.defaultBranch,
        });

        if (!response.success) {
          throw new Error(response.error?.message || "Failed to commit");
        }

        setSuccess(`Documentation committed successfully!`);
      }
    } catch (err: any) {
      console.error("Error pushing documentation:", err);
      setError(
        err.message || "Failed to push documentation. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return { commit, loading, success, error, setSuccess, setError };
}
