import { z } from "zod";

export const updateDocSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  documentType: z.string().min(1, "Document type is required").optional(),
  content: z.string().min(1, "Content is required").optional(),
  changeDescription: z.string().optional(),
});

export type UpdateDocSchema = z.infer<typeof updateDocSchema>;
