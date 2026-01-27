import { z } from "zod";

export const DocHistoryEntrySchema = z.object({
  _id: z.string().optional(),
  docId: z.string(),
  userId: z.string(),
  title: z.string(),
  documentType: z.string(),
  content: z.string(),
  version: z.number(),
  changeDescription: z.string().optional(),
  createdAt: z.string(),
});

export const PaginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
});


