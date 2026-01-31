// lib/store/useDocReviewStore.ts
import { create } from "zustand";
import { DocReview } from "../@types/review";
import { endpoints } from "../api/endpoints";

interface ProgressState {
  value: number;
  message: string;
}

interface DocReviewState {
  review: DocReview | null;
  loading: boolean;
  error: string | null;
  progress: ProgressState;

  setReview: (review: DocReview) => void;
  reviewDocs: (data: string) => Promise<void>;
  clearReview: () => void;
  resetProgress: () => void;
}

const PROGRESS_STAGES = [
  { value: 10, message: "Preparing documentation...", delay: 300 },
  { value: 25, message: "Analyzing structure...", delay: 500 },
  { value: 40, message: "Checking completeness...", delay: 700 },
  { value: 55, message: "Reviewing content quality...", delay: 900 },
  { value: 70, message: "Identifying improvements...", delay: 1100 },
  { value: 85, message: "Generating insights...", delay: 1300 },
  { value: 95, message: "Finalizing review...", delay: 1500 },
];

export const useDocReviewStore = create<DocReviewState>((set, get) => ({
  review: null,
  loading: false,
  error: null,
  progress: { value: 0, message: "" },

  setReview: (review) => set({ review }),

  resetProgress: () => set({ progress: { value: 0, message: "" } }),

  reviewDocs: async (data) => {
    set({
      loading: true,
      error: null,
      progress: { value: 0, message: "Initializing..." },
    });

    const progressInterval = setInterval(() => {
      const currentProgress = get().progress.value;
      const nextStage = PROGRESS_STAGES.find(
        (stage) => stage.value > currentProgress,
      );

      if (nextStage && get().loading) {
        set({
          progress: { value: nextStage.value, message: nextStage.message },
        });
      }
    }, 400);

    try {
      const response = await endpoints.reviewDocs({ data });

      if (!response.success || !response.data) {
        throw new Error(response.error?.message || "Review failed");
      }

      const reviewData =
        response.data.data.review ||
        response.data.data?.review ||
        response.data;

      set({ progress: { value: 100, message: "Complete!" } });
      await new Promise((resolve) => setTimeout(resolve, 500));

      set({ review: reviewData });
    } catch (err: any) {
      set({ error: err.message || "An error occurred" });
    } finally {
      clearInterval(progressInterval);
      set({ loading: false });
      setTimeout(() => {
        set({ progress: { value: 0, message: "" } });
      }, 1000);
    }
  },

  clearReview: () =>
    set({
      review: null,
      progress: { value: 0, message: "" },
    }),
}));
