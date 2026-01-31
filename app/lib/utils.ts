import { clsx, type ClassValue } from "clsx";
import { formatDistanceToNow } from "date-fns";
import { twMerge } from "tailwind-merge";
import { RETRY_OPTIONS, VALID_DOC_TYPES } from "./services/groq/config";
import { DocType, RepoContext, RetryOptions } from "./@types/common";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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

/**
 * Safely parse JSON from AI response, handling malformed strings and edge cases
 */
export function safeParseJSON(raw: string) {
  try {
    // First, try to find JSON object in the response
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) {
      console.error("RAW AI RESPONSE:", raw);
      throw new Error("No JSON object found in AI response");
    }

    let jsonStr = match[0];

    // Fix common JSON issues
    jsonStr = fixCommonJSONIssues(jsonStr);

    // Try to parse
    return JSON.parse(jsonStr);
  } catch (error: any) {
    console.error("JSON Parse Error:", error.message);
    console.error("Attempted to parse:", raw.substring(0, 500));

    // If parsing still fails, try more aggressive fixes
    try {
      const cleaned = aggressiveJSONClean(raw);
      return JSON.parse(cleaned);
    } catch (secondError: any) {
      throw new Error(
        `AI returned invalid JSON: ${error.message}. Response preview: ${raw.substring(0, 200)}...`,
      );
    }
  }
}

/**
 * Fix common JSON formatting issues from AI responses
 */
function fixCommonJSONIssues(jsonStr: string): string {
  // Remove any trailing commas before closing braces/brackets
  jsonStr = jsonStr.replace(/,(\s*[}\]])/g, "$1");

  // Fix unescaped quotes in strings (basic attempt)
  // This is tricky and may not catch all cases
  jsonStr = jsonStr.replace(/([^\\])"([^"]*[^\\])"([^:])/g, '$1\\"$2\\"$3');

  // Remove any control characters
  jsonStr = jsonStr.replace(/[\x00-\x1F\x7F]/g, "");

  // Fix newlines in strings
  jsonStr = jsonStr.replace(/\n/g, "\\n");
  jsonStr = jsonStr.replace(/\r/g, "\\r");
  jsonStr = jsonStr.replace(/\t/g, "\\t");

  return jsonStr;
}

/**
 * More aggressive JSON cleaning for severely malformed responses
 */
function aggressiveJSONClean(raw: string): string {
  // Extract everything between first { and last }
  const firstBrace = raw.indexOf("{");
  const lastBrace = raw.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error("No valid JSON object boundaries found");
  }

  let jsonStr = raw.substring(firstBrace, lastBrace + 1);

  // Try to find and fix unterminated strings
  jsonStr = fixUnterminatedStrings(jsonStr);

  // Apply basic fixes
  jsonStr = fixCommonJSONIssues(jsonStr);

  return jsonStr;
}

/**
 * Attempt to fix unterminated strings in JSON
 */
function fixUnterminatedStrings(jsonStr: string): string {
  const lines = jsonStr.split("\n");
  const fixed: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Count quotes in the line
    const quoteCount = (line.match(/"/g) || []).length;

    // If odd number of quotes, try to close the string
    if (quoteCount % 2 !== 0) {
      // Check if this is a value line (has a colon)
      if (line.includes(":")) {
        // Add closing quote before comma or closing brace
        if (line.includes(",")) {
          line = line.replace(/,\s*$/, '",');
        } else if (
          i === lines.length - 1 ||
          lines[i + 1].trim().startsWith("}")
        ) {
          line = line + '"';
        }
      }
    }

    fixed.push(line);
  }

  return fixed.join("\n");
}

/**
 * Safely parse JSON with automatic retry and fallback
 */
export function safeParseJSONWithFallback<T>(raw: string, fallback: T): T {
  try {
    return safeParseJSON(raw) as T;
  } catch (error) {
    console.error("Failed to parse JSON, using fallback:", error);
    return fallback;
  }
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

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

export function validateDocType(docType: DocType): asserts docType is DocType {
  if (!VALID_DOC_TYPES.includes(docType as any)) {
    throw new Error(
      `Invalid docType: ${docType}. Valid types are: ${VALID_DOC_TYPES.join(", ")}`,
    );
  }
}

export function validateContextData(contextData: string | RepoContext): void {
  if (!contextData) {
    throw new Error("contextData cannot be empty");
  }

  if (typeof contextData === "string" && contextData.trim().length === 0) {
    throw new Error("contextData string cannot be empty or whitespace only");
  }

  if (typeof contextData === "object") {
    if (!contextData.repoName || !contextData.owner) {
      throw new Error("RepoContext must have repoName and owner");
    }
    if (!contextData.files || contextData.files.length === 0) {
      throw new Error("RepoContext must have at least one file");
    }
  }
}
