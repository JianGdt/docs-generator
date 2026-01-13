import { z } from "zod";

export const generateRequestSchema = z.object({
  method: z.enum(["github", "code", "upload"]),
  data: z.string().min(1, "Data is required"),
  docType: z.enum(["readme", "api", "guide", "contributing"]),
});

export const githubUrlSchema = z
  .string()
  .url("Invalid URL format")
  .regex(
    /github\.com\/[\w-]+\/[\w-]+/,
    "Must be a valid GitHub repository URL"
  );

export function validateGithubUrl(url: string) {
  return githubUrlSchema.safeParse(url);
}

export const signUpSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name must be less than 50 characters" })
    .trim(),
  email: z
    .string()
    .email({ message: "Please enter a valid email address" })
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain an uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain a lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain a number" })
    .regex(/[^A-Za-z0-9]/, {
      message: "Password must contain a special character",
    }),
});

export const signInSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address" })
    .trim(),
  password: z.string().min(1, { message: "Password is required" }),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type FormState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
  };
  message?: string;
};
