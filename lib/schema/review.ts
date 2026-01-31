import { z } from "zod";

export const docSectionIssueSchema = z.object({
  section: z.string(),
  severity: z.enum(["low", "medium", "high"]),
  message: z.string(),
  suggestion: z.string().optional(),
});

export const docReviewSchema = z.object({
  score: z.number().min(0).max(10),
  summary: z.string(),

  missingSections: z.array(z.string()),
  outdatedWarnings: z.array(z.string()),
  improvements: z.array(z.string()),
  positives: z.array(z.string()),
});

export type DocReviewResult = z.infer<typeof docReviewSchema>;
