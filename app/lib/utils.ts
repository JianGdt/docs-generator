import { clsx, type ClassValue } from "clsx";
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
