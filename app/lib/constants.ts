export const DOC_TYPES = {
  readme: "README.md",
  api: "API Docs",
  guide: "User Guide",
  contributing: "CONTRIBUTING.md",
} as const;

export const INPUT_METHODS = {
  github: "GitHub Repo",
  code: "Paste Code",
  upload: "Upload Files",
} as const;

export const EXAMPLE_GITHUB_URL = "https://github.com/~~~~";

export const EXAMPLE_CODE = `example code nyo langs`;

export const ENV = {
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  MONGODB_URI: process.env.MONGODB_URL, 
  GITHUB_TOKEN: process.env.GITHUB_TOKEN,
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  AUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NODE_ENV: process.env.NODE_ENV,
} as const;

if (typeof window === "undefined") {
  if (!ENV.GROQ_API_KEY) {
    console.error("❌ GROQ_API_KEY is missing");
  }
  if (!ENV.MONGODB_URI) {
    console.error("❌ MONGODB_URI is missing");
  }
}
