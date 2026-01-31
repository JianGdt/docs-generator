export interface DocSectionIssue {
  section: string;
  severity: "low" | "medium" | "high";
  message: string;
  suggestion?: string;
}

// Raw AI output
export interface DocReviewAI {
  score: number;
  summary: string;
  missingSections: string[];
  outdatedWarnings: string[];
  improvements: string[];
  positives: string[];
}

export interface DocReview extends DocReviewAI {
  _id: string;
  userId: string;
  docId?: string | null;
  docType: "readme" | "api" | "guide" | string;
  createdAt: string;
}

export type DocReviewInsert = Omit<DocReview, "_id" | "createdAt">;
