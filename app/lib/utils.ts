import { clsx, type ClassValue } from "clsx";
import { formatDistanceToNow } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateReadingTime(
  text: string,
  wordsPerMinute: number = 200
): number {
  const words = text.trim().split(/\s+/).length;
  const minutes = words / wordsPerMinute;
  return Math.ceil(minutes);
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
