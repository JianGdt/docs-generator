import { Repository } from "@//lib/@types/github";
import { endpoints } from "@//lib/api/endpoints";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

export function useGitHubRepositories() {
  const { data: session } = useSession();
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasFetchedRef = useRef(false);

  const fetchRepositories = async () => {
    if (session?.provider !== "github") {
      console.log("Not logged in via GitHub, skipping repository fetch");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await endpoints.getRepositories();

      if (!response.success || !response.data) {
        throw new Error(
          response.error?.message || "Failed to fetch repositories",
        );
      }
      if (
        response.data.repositories &&
        Array.isArray(response.data.repositories)
      ) {
        setRepositories(response.data.repositories);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err: any) {
      console.error("Failed to fetch repositories:", err);
      setError(
        err.message ||
          "Failed to fetch repositories. Please try reconnecting your GitHub account.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      session?.provider === "github" &&
      session?.accessToken &&
      !hasFetchedRef.current
    ) {
      hasFetchedRef.current = true;
      fetchRepositories();
    }
  }, [session?.provider, session?.accessToken]);

  return {
    repositories,
    loading,
    error,
    refetch: fetchRepositories,
    isGitHubUser: session?.provider === "github",
  };
}
