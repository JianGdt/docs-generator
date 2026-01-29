export const GROQ_CONFIG = {
  model: "openai/gpt-oss-120b",
  temperature: 0.2,
  maxTokens: 4000,
} as const;

export const CONTENT_LIMITS = {
  config: 1500,
  auth: 1500,
  api: 1500,
  other: 1500,
} as const;

export const VALID_DOC_TYPES = [
  "readme",
  "api",
  "guide",
  "architecture",
  "contributing",
] as const;

export const RETRY_OPTIONS = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 10000,
} as const;
