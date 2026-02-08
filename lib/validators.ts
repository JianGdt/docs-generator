import z from "zod";
import { githubUrlSchema } from "./schema/github";
import { VALID_DOC_TYPES } from "./services/groq";
import { DocType, RepoContext } from "./@types/common";

export const validateGithubUrl = (url: string) => {
  return githubUrlSchema.safeParse(url);
};

export const passwordRules = z
  .string()
  .min(8, "Password must be at least 8 characters long.")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
  .regex(/[0-9]/, "Password must contain at least one number.")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character.",
  );

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
