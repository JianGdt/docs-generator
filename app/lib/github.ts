import axios from 'axios';
import { Octokit } from "@octokit/rest";
import { GitHubRepo, GitHubFile } from './types';
import { ENV } from './constants';

const COMMON_FILES = [
  'package.json',
  'README.md',
  'src/index.ts',
  'src/index.js',
  'index.ts',
  'index.js',
];

// GitHubService class for authenticated operations
export class GitHubService {
  private octokit: Octokit;

  constructor(accessToken: string) {
    this.octokit = new Octokit({
      auth: accessToken,
    });
  }

  // Get authenticated user info
  async getAuthenticatedUser() {
    try {
      const { data } = await this.octokit.users.getAuthenticated();
      return data;
    } catch (error) {
      throw new Error("Failed to fetch user information");
    }
  }

  // Get authenticated user repositories
  async getUserRepositories() {
    try {
      const { data } = await this.octokit.repos.listForAuthenticatedUser({
        sort: "updated",
        per_page: 100,
        visibility: "all",
      });
      return data;
    } catch (error) {
      throw new Error("Failed to fetch repositories");
    }
  }

  // Get repository details
  async getRepository(owner: string, repo: string) {
    try {
      const { data } = await this.octokit.repos.get({
        owner,
        repo,
      });
      return data;
    } catch (error) {
      throw new Error("Failed to fetch repository details");
    }
  }

  // Get repository branches
  async getBranches(owner: string, repo: string) {
    try {
      const { data } = await this.octokit.repos.listBranches({
        owner,
        repo,
        per_page: 100,
      });
      return data;
    } catch (error) {
      throw new Error("Failed to fetch branches");
    }
  }

  // Create or update a file in repository
  async commitFile({
    owner,
    repo,
    path,
    content,
    message,
    branch = "main",
  }: {
    owner: string;
    repo: string;
    path: string;
    content: string;
    message: string;
    branch?: string;
  }) {
    try {
      // Check if file exists
      let sha: string | undefined;
      try {
        const { data: existingFile } = await this.octokit.repos.getContent({
          owner,
          repo,
          path,
          ref: branch,
        });
        if ("sha" in existingFile) {
          sha = existingFile.sha;
        }
      } catch (error: any) {
        // File doesn't exist, will create new
        if (error.status !== 404) {
          throw error;
        }
      }

      // Create or update file
      const { data } = await this.octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message,
        content: Buffer.from(content).toString("base64"),
        branch,
        ...(sha && { sha }),
      });

      return data;
    } catch (error: any) {
      console.error("Commit file error:", error);
      throw new Error(error.message || "Failed to commit file");
    }
  }

  // Create a pull request
  async createPullRequest({
    owner,
    repo,
    title,
    body,
    head,
    base = "main",
  }: {
    owner: string;
    repo: string;
    title: string;
    body?: string;
    head: string;
    base?: string;
  }) {
    try {
      const { data } = await this.octokit.pulls.create({
        owner,
        repo,
        title,
        body: body || "",
        head,
        base,
      });
      return data;
    } catch (error: any) {
      console.error("Create PR error:", error);
      throw new Error(error.message || "Failed to create pull request");
    }
  }

  // Create a new branch
  async createBranch({
    owner,
    repo,
    branch,
    fromBranch = "main",
  }: {
    owner: string;
    repo: string;
    branch: string;
    fromBranch?: string;
  }) {
    try {
      // Get the SHA of the latest commit on the base branch
      const { data: ref } = await this.octokit.git.getRef({
        owner,
        repo,
        ref: `heads/${fromBranch}`,
      });

      // Create new branch
      const { data } = await this.octokit.git.createRef({
        owner,
        repo,
        ref: `refs/heads/${branch}`,
        sha: ref.object.sha,
      });

      return data;
    } catch (error: any) {
      console.error("Create branch error:", error);
      throw new Error(error.message || "Failed to create branch");
    }
  }

  // Get file content
  async getFileContent(owner: string, repo: string, path: string, ref?: string) {
    try {
      const { data } = await this.octokit.repos.getContent({
        owner,
        repo,
        path,
        ...(ref && { ref }),
      });

      if ("content" in data) {
        return {
          content: Buffer.from(data.content, "base64").toString("utf-8"),
          sha: data.sha,
        };
      }

      throw new Error("Not a file");
    } catch (error: any) {
      if (error.status === 404) {
        return null;
      }
      throw new Error("Failed to fetch file content");
    }
  }

  // List commits for a repository
  async listCommits(owner: string, repo: string, options?: { path?: string; per_page?: number }) {
    try {
      const { data } = await this.octokit.repos.listCommits({
        owner,
        repo,
        ...(options?.path && { path: options.path }),
        per_page: options?.per_page || 30,
      });
      return data;
    } catch (error) {
      throw new Error("Failed to fetch commits");
    }
  }
}

// Standalone functions for fetching public repositories
export async function fetchGitHubRepo(repoUrl: string): Promise<GitHubRepo> {
  const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) throw new Error('Invalid GitHub URL');

  const [, owner, repo] = match;
  const cleanRepo = repo.replace(/\.git$/, '');

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
  };

  if (ENV.GITHUB_TOKEN) {
    headers.Authorization = `token ${ENV.GITHUB_TOKEN}`;
  }

  try {
    const repoResponse = await axios.get(
      `https://api.github.com/repos/${owner}/${cleanRepo}`,
      { headers }
    );

    const files = await fetchFiles(owner, cleanRepo, COMMON_FILES, headers);

    return {
      name: repoResponse.data.name,
      description: repoResponse.data.description || '',
      language: repoResponse.data.language || 'Unknown',
      stars: repoResponse.data.stargazers_count || 0,
      files,
    };
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error('Repository not found');
    }
    if (error.response?.status === 403) {
      throw new Error('GitHub API rate limit exceeded');
    }
    throw new Error(`Failed to fetch: ${error.message}`);
  }
}

async function fetchFiles(
  owner: string,
  repo: string,
  paths: string[],
  headers: Record<string, string>
): Promise<GitHubFile[]> {
  const results = await Promise.allSettled(
    paths.map((path) => fetchFile(owner, repo, path, headers))
  );

  return results
    .filter((r) => r.status === 'fulfilled')
    .map((r) => (r as PromiseFulfilledResult<GitHubFile | null>).value)
    .filter((f): f is GitHubFile => f !== null);
}

async function fetchFile(
  owner: string,
  repo: string,
  path: string,
  headers: Record<string, string>
): Promise<GitHubFile | null> {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      { headers }
    );

    if (response.data.content) {
      const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
      return { 
        path, 
        content: content.substring(0, 5000) 
      };
    }
    return null;
  } catch {
    return null;
  }
}