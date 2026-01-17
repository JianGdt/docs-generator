import { z } from "zod";
import { githubUrlSchema } from "./schema/github";

export const passwordRules = z
  .string()
  .min(8, "Password must be at least 8 characters long.")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
  .regex(/[0-9]/, "Password must contain at least one number.")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character."
  );

export const generateRequestSchema = z
  .object({
    method: z.enum(["github", "code", "upload"]),
    data: z.string().min(1, "Data is required."),
    docType: z.enum(["readme", "api", "guide", "contributing"]),
  })
  .strict();

export const validateGithubUrl = (url: string) => {
  return githubUrlSchema.safeParse(url);
};

export type GithubUrlInput = z.infer<typeof githubUrlSchema>;
export type GenerateRequestInput = z.infer<typeof generateRequestSchema>;
