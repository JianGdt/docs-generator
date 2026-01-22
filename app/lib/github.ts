import axios from "axios";
import { Octokit } from "@octokit/rest";
import { GitHubRepo, GitHubFile } from "./types";
import { CRITICAL_FILES, ENV, SAMPLE_FILES } from "./constants";

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
        if (error.status !== 404) {
          throw error;
        }
      }

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
      const { data: ref } = await this.octokit.git.getRef({
        owner,
        repo,
        ref: `heads/${fromBranch}`,
      });

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

  async getFileContent(
    owner: string,
    repo: string,
    path: string,
    ref?: string,
  ) {
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
  async listCommits(
    owner: string,
    repo: string,
    options?: { path?: string; per_page?: number },
  ) {
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

// Enhanced repository analysis
interface EnhancedGitHubRepo extends GitHubRepo {
  owner: string;
  repoName: string;
  packageJson?: any;
  fileStructure: string[];
  techStack?: {
    framework: string[];
    ui: string[];
    auth: string[];
    database: string[];
    api: string[];
    other: string[];
  };
}

export async function fetchGitHubRepo(
  repoUrl: string,
): Promise<EnhancedGitHubRepo> {
  const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) throw new Error("Invalid GitHub URL");

  const [, owner, repo] = match;
  const cleanRepo = repo.replace(/\.git$/, "");

  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
  };

  if (ENV.GITHUB_TOKEN) {
    headers.Authorization = `token ${ENV.GITHUB_TOKEN}`;
  }

  try {
    const repoResponse = await axios.get(
      `https://api.github.com/repos/${owner}/${cleanRepo}`,
      { headers },
    );

    const treeResponse = await axios.get(
      `https://api.github.com/repos/${owner}/${cleanRepo}/git/trees/HEAD?recursive=1`,
      { headers },
    );

    const fileStructure = treeResponse.data.tree
      .filter((item: any) => item.type === "blob")
      .map((item: any) => item.path)
      .slice(0, 100);
    const allFiles = [...CRITICAL_FILES, ...SAMPLE_FILES];
    const files = await fetchFiles(owner, cleanRepo, allFiles, headers);

    // Extract package.json if available
    const packageJsonFile = files.find((f) => f.path === "package.json");
    let packageJson = null;
    let techStack = undefined;

    if (packageJsonFile) {
      try {
        packageJson = JSON.parse(packageJsonFile.content);
        techStack = identifyTechStack(packageJson);
      } catch (error) {
        console.error("Failed to parse package.json:", error);
      }
    }

    return {
      owner,
      repoName: cleanRepo,
      name: repoResponse.data.name,
      description: repoResponse.data.description || "",
      language: repoResponse.data.language || "Unknown",
      stars: repoResponse.data.stargazers_count || 0,
      files,
      fileStructure,
      packageJson,
      techStack,
    };
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error("Repository not found");
    }
    if (error.response?.status === 403) {
      throw new Error("GitHub API rate limit exceeded");
    }
    throw new Error(`Failed to fetch: ${error.message}`);
  }
}

async function fetchFiles(
  owner: string,
  repo: string,
  paths: string[],
  headers: Record<string, string>,
): Promise<GitHubFile[]> {
  const results = await Promise.allSettled(
    paths.map((path) => fetchFile(owner, repo, path, headers)),
  );

  return results
    .filter((r) => r.status === "fulfilled")
    .map((r) => (r as PromiseFulfilledResult<GitHubFile | null>).value)
    .filter((f): f is GitHubFile => f !== null);
}

async function fetchFile(
  owner: string,
  repo: string,
  path: string,
  headers: Record<string, string>,
): Promise<GitHubFile | null> {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      { headers },
    );

    if (response.data.content) {
      const content = Buffer.from(response.data.content, "base64").toString(
        "utf-8",
      );
      // Increase limit for package.json, limit others
      const maxLength = path === "package.json" ? 50000 : 5000;
      return {
        path,
        content: content.substring(0, maxLength),
      };
    }
    return null;
  } catch {
    return null;
  }
}

function identifyTechStack(packageJson: any): {
  framework: string[];
  ui: string[];
  auth: string[];
  database: string[];
  api: string[];
  other: string[];
} {
  const deps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };

  const stack = {
    framework: [] as string[],
    ui: [] as string[],
    auth: [] as string[],
    database: [] as string[],
    api: [] as string[],
    other: [] as string[],
  };

  if (deps["next"])
    stack.framework.push(
      `Next.js ${packageJson.dependencies?.next || deps["next"]}`,
    );
  if (deps["react"])
    stack.framework.push(
      `React ${packageJson.dependencies?.react || deps["react"]}`,
    );
  if (deps["typescript"]) stack.framework.push("TypeScript");

  // UI
  if (deps["tailwindcss"]) stack.ui.push("Tailwind CSS");
  if (deps["@radix-ui/react-label"] || deps["@radix-ui/react-select"])
    stack.ui.push("Radix UI");
  if (deps["lucide-react"]) stack.ui.push("Lucide Icons");
  if (deps["next-themes"]) stack.ui.push("next-themes");
  if (deps["sonner"]) stack.ui.push("Sonner");
  if (deps["class-variance-authority"]) stack.ui.push("CVA");

  // Auth
  if (deps["next-auth"]) stack.auth.push("NextAuth.js");
  if (deps["@auth/core"]) stack.auth.push("Auth.js Core");
  if (deps["bcryptjs"]) stack.auth.push("bcryptjs");
  if (deps["jose"]) stack.auth.push("JOSE");

  // Database
  if (deps["mongodb"]) stack.database.push("MongoDB");
  if (deps["@auth/mongodb-adapter"]) stack.database.push("MongoDB Adapter");
  if (deps["mongoose"]) stack.database.push("Mongoose");
  if (deps["prisma"]) stack.database.push("Prisma");

  // API
  if (deps["groq-sdk"]) stack.api.push("Groq SDK");
  if (deps["@octokit/rest"]) stack.api.push("Octokit");
  if (deps["axios"]) stack.api.push("Axios");

  // Other
  if (deps["zustand"]) stack.other.push("Zustand");
  if (deps["react-hook-form"]) stack.other.push("React Hook Form");
  if (deps["zod"]) stack.other.push("Zod");
  if (deps["@hookform/resolvers"]) stack.other.push("Hookform Resolvers");

  return stack;
}

export function extractDirectoryStructure(files: string[]): string[] {
  const dirs = new Set<string>();

  files.forEach((file) => {
    const parts = file.split("/");
    if (parts.length > 1) {
      dirs.add(parts[0]);
    }
  });

  return Array.from(dirs).sort();
}
