import { Code2, Github, Upload } from "lucide-react";
import { InputMethod } from "./types";

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
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
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

export const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const ALLOWED_EXTENSIONS = [
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".json",
  ".md",
];

export const inputMethods = [
  { id: "github" as InputMethod, label: INPUT_METHODS.github, icon: Github },
  { id: "code" as InputMethod, label: INPUT_METHODS.code, icon: Code2 },
  { id: "upload" as InputMethod, label: INPUT_METHODS.upload, icon: Upload },
];

export const CRITICAL_FILES = [
  "package.json",
  "README.md",
  "next.config.ts",
  "next.config.js",
  "next.config.mjs",
  "tsconfig.json",
  ".env.example",
  "tailwind.config.ts",
  "tailwind.config.js",
];

export const SAMPLE_FILES = [
  "app/page.tsx",
  "app/layout.tsx",
  "src/index.ts",
  "src/index.js",
  "index.ts",
  "index.js",
  "lib/utils.ts",
  "components/ui/button.tsx",
];

export const DUMMY_HASH = "$2a$10$dummyhashtopreventtimingattacks1234567890";

export const IMAGES = {
  robot: { src: "/images/robot.png", alt: "zodiac" },
};
