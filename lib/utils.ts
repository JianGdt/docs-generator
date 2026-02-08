import { clsx, type ClassValue } from "clsx";
import { formatDistanceToNow } from "date-fns";
import { twMerge } from "tailwind-merge";
import { RepoContext, RetryOptions } from "./@types/common";
import { RETRY_OPTIONS } from "./services/groq/config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (dateString?: string): string => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return "N/A";
  }
};

export function formatDateHistory(dateInput: string | Date): string {
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  const diffHours = (Date.now() - date.getTime()) / (1000 * 60 * 60);

  if (diffHours < 24) return "Today";
  if (diffHours < 48) return "Yesterday";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export const downloadMarkdown = (content: string, filename: string): void => {
  const blob = new Blob([content], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const openInNewTab = (content: string): void => {
  const blob = new Blob([content], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
};

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

export function truncateContent(content: string, maxLength: number): string {
  if (content.length <= maxLength) {
    return content;
  }

  const truncated = content.slice(0, maxLength);
  const lastNewline = truncated.lastIndexOf("\n");
  const lastSpace = truncated.lastIndexOf(" ");

  if (lastNewline > maxLength * 0.8) {
    return truncated.slice(0, lastNewline) + "\n... [truncated]";
  }

  if (lastSpace > maxLength * 0.9) {
    return truncated.slice(0, lastSpace) + " ... [truncated]";
  }

  return truncated + "... [truncated]";
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = RETRY_OPTIONS,
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= options.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      if (
        error.message?.includes("context_length") ||
        error.message?.includes("invalid") ||
        error.message?.includes("authentication")
      ) {
        throw error;
      }

      if (attempt === options.maxRetries) {
        break;
      }

      const delay = Math.min(
        options.initialDelay * Math.pow(2, attempt),
        options.maxDelay,
      );

      console.warn(
        `Attempt ${attempt + 1} failed, retrying in ${delay}ms...`,
        error.message,
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError || new Error("Unknown error occurred during retry");
}

export function getDefaultPath(docType: string): string {
  const pathMap: Record<string, string> = {
    readme: "README.md",
    api: "docs/API.md",
    contributing: "CONTRIBUTING.md",
    changelog: "CHANGELOG.md",
    license: "LICENSE.md",
  };
  return pathMap[docType.toLowerCase()] || `${docType.toUpperCase()}.md`;
}

export function buildTechStackSection(
  techStack: NonNullable<RepoContext["techStack"]>,
): string {
  const sections = [
    { key: "framework" as const, title: "Framework & Core" },
    { key: "ui" as const, title: "UI & Styling" },
    { key: "auth" as const, title: "Authentication" },
    { key: "database" as const, title: "Database" },
    { key: "api" as const, title: "APIs & SDKs" },
    { key: "other" as const, title: "Other Tools" },
  ];

  return sections
    .filter(({ key }) => techStack[key] && techStack[key].length > 0)
    .map(({ key, title }) => {
      const items = techStack[key]!.map((t: string) => `- ${t}`).join("\n");
      return `\n### ${title}\n${items}\n`;
    })
    .join("");
}
