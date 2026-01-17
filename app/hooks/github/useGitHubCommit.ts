import { useState } from "react";
import axios from "axios";
import { CommitFormValues } from "@/app/lib/schema/github";
import { Repository } from "@/app/lib/types";

export function useGitHubCommit() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const commit = async (
    values: CommitFormValues,
    content: string,
    repositories: Repository[]
  ) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const selectedRepo = repositories.find(
        (r) => r.fullName === values.repository
      );

      if (!selectedRepo) {
        throw new Error("Repository not found");
      }

      if (values.createPR) {
        const branchName = `docs/${Date.now()}`;
        const { data } = await axios.post("/api/github/pull-request", {
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

        setSuccess(
          `Pull request created successfully! PR #${data.pullRequest.number}`
        );
      } else {
        const { data } = await axios.post("/api/github/commit", {
          owner: selectedRepo.owner,
          repo: selectedRepo.name,
          path: values.path,
          content,
          message: values.message,
          branch: selectedRepo.defaultBranch,
        });

        setSuccess(`Documentation committed #${data} successfully!`);
      }
    } catch (err: any) {
      console.error("Error pushing documentation:", err);
      setError(
        err.response?.data?.error ||
          err.message ||
          "Failed to push documentation. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return { commit, loading, success, error, setSuccess, setError };
}
