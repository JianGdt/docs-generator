import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx and tailwind-merge for optimal class handling
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format large numbers with abbreviations (K, M, B)
 * @param num - Number to format
 * @returns Formatted string (e.g., "1.5K", "2.3M")
 */
export function formatNumber(num: number): string {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
}

/**
 * Calculate estimated reading time based on word count
 * @param text - Text to analyze
 * @param wordsPerMinute - Average reading speed (default: 200)
 * @returns Reading time in minutes
 */
export function calculateReadingTime(
  text: string,
  wordsPerMinute: number = 200
): number {
  const words = text.trim().split(/\s+/).length;
  const minutes = words / wordsPerMinute;
  return Math.ceil(minutes);
}

/**
 * Truncate text to a maximum length with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum character length
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

/**
 * Get file extension from filename
 * @param filename - Name of the file
 * @returns File extension (lowercase, without dot)
 */
export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop()!.toLowerCase() : '';
}

/**
 * Check if a string is a valid URL
 * @param str - String to validate
 * @returns True if valid URL
 */
export function isValidUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * Format date to human-readable string
 * @param date - Date object or ISO string
 * @returns Formatted date string
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format date to relative time (e.g., "2 hours ago")
 * @param date - Date object or ISO string
 * @returns Relative time string
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
}

/**
 * Debounce function to limit execution rate
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function to limit execution frequency
 * @param func - Function to throttle
 * @param limit - Time limit in milliseconds
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Sleep/delay function
 * @param ms - Milliseconds to sleep
 * @returns Promise that resolves after delay
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generate a random ID
 * @param length - Length of the ID (default: 8)
 * @returns Random alphanumeric ID
 */
export function generateId(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Copy text to clipboard
 * @param text - Text to copy
 * @returns Promise that resolves when copied
 */
export async function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    await navigator.clipboard.writeText(text);
  } else {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
}

/**
 * Download text as file
 * @param content - Content to download
 * @param filename - Name of the file
 * @param mimeType - MIME type (default: text/plain)
 */
export function downloadFile(
  content: string,
  filename: string,
  mimeType: string = 'text/plain'
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Parse GitHub URL and extract owner and repo
 * @param url - GitHub repository URL
 * @returns Object with owner and repo or null
 */
export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) return null;

  const [, owner, repoWithExt] = match;
  const repo = repoWithExt.replace(/\.git$/, '');

  return { owner, repo };
}

/**
 * Calculate file size from string
 * @param text - Text content
 * @returns Size object with bytes and formatted string
 */
export function calculateFileSize(text: string): {
  bytes: number;
  formatted: string;
} {
  const bytes = new Blob([text]).size;
  let formatted: string;

  if (bytes >= 1024 * 1024) {
    formatted = `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  } else if (bytes >= 1024) {
    formatted = `${(bytes / 1024).toFixed(2)} KB`;
  } else {
    formatted = `${bytes} bytes`;
  }

  return { bytes, formatted };
}

/**
 * Count occurrences of a character/string in text
 * @param text - Text to search
 * @param search - Character or string to count
 * @returns Number of occurrences
 */
export function countOccurrences(text: string, search: string): number {
  return (text.match(new RegExp(search, 'g')) || []).length;
}

/**
 * Extract code blocks from markdown
 * @param markdown - Markdown text
 * @returns Array of code blocks with language
 */
export function extractCodeBlocks(markdown: string): Array<{
  language: string;
  code: string;
}> {
  const regex = /```(\w+)?\n([\s\S]*?)```/g;
  const blocks: Array<{ language: string; code: string }> = [];
  let match;

  while ((match = regex.exec(markdown)) !== null) {
    blocks.push({
      language: match[1] || 'plaintext',
      code: match[2].trim(),
    });
  }

  return blocks;
}

/**
 * Sanitize filename (remove invalid characters)
 * @param filename - Original filename
 * @returns Sanitized filename
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-z0-9._-]/gi, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase();
}

/**
 * Check if code is running on client side
 * @returns True if client-side
 */
export function isClient(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Check if code is running on server side
 * @returns True if server-side
 */
export function isServer(): boolean {
  return typeof window === 'undefined';
}

/**
 * Format bytes to human-readable size
 * @param bytes - Number of bytes
 * @param decimals - Decimal places (default: 2)
 * @returns Formatted string
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Capitalize first letter of string
 * @param str - String to capitalize
 * @returns Capitalized string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert string to kebab-case
 * @param str - String to convert
 * @returns Kebab-cased string
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * Convert string to camelCase
 * @param str - String to convert
 * @returns CamelCased string
 */
export function toCamelCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^(.)/, (c) => c.toLowerCase());
}

/**
 * Get random item from array
 * @param array - Array to pick from
 * @returns Random item
 */
export function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Shuffle array
 * @param array - Array to shuffle
 * @returns Shuffled array
 */
export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}