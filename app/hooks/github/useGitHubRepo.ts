import { useState, useEffect } from "react";
import axios from "axios";
import { Repository } from "@/app/lib/types";

export function useGitHubRepositories(accessToken?: string) {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRepositories = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.get("/api/github/repositories");

      if (data.repositories && Array.isArray(data.repositories)) {
        setRepositories(data.repositories);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err: any) {
      console.error("Failed to fetch repositories:", err);
      setError(
        err.response?.data?.error ||
          "Failed to fetch repositories. Please try reconnecting your GitHub account."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchRepositories();
    }
  }, [accessToken]);

  return { repositories, loading, error, refetch: fetchRepositories };
}
