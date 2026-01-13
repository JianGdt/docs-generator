import axios from 'axios';
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