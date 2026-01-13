import { z } from "zod";

const passwordRules = z
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

export type GenerateRequestInput = z.infer<typeof generateRequestSchema>;

export const githubUrlSchema = z
  .string()
  .url("Invalid URL format.")
  .regex(
    /github\.com\/[\w.-]+\/[\w.-]+$/i,
    "Must be a valid GitHub repository URL."
  );

export const validateGithubUrl = (url: string) => {
  return githubUrlSchema.safeParse(url);
};

export type GithubUrlInput = z.infer<typeof githubUrlSchema>;

export const signUpSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters.")
      .max(50, "Name must be less than 50 characters.")
      .trim(),
    email: z
      .string()
      .email("Please enter a valid email address.")
      .toLowerCase()
      .trim(),
    password: passwordRules,
  })
  .strip();

export type SignUpInput = z.infer<typeof signUpSchema>;

export const signInSchema = z
  .object({
    email: z.string().email("Please enter a valid email address.").trim(),
    password: z.string().min(1, "Password is required."),
  })
  .strip();

export type SignInInput = z.infer<typeof signInSchema>;

export type FormState = {
  errors?: Partial<Record<"name" | "email" | "password", string[]>>;
  message?: string;
};
