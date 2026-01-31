import mongoose, { Schema, Document } from "mongoose";
import { IDocReview } from "./models.types";

const DocReviewSchema = new Schema<IDocReview>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    docId: {
      type: String,
    },
    reviewType: {
      type: String,
      required: true,
    },
    feedback: {
      type: String,
      required: true,
    },
    suggestions: [
      {
        type: String,
      },
    ],
    rating: {
      type: Number,
    },
  },
  {
    timestamps: true,
  },
);

DocReviewSchema.index({ userId: 1, createdAt: -1 });
DocReviewSchema.index({ docId: 1 });

export default mongoose.models.DocReview ||
  mongoose.model<IDocReview>("DocReview", DocReviewSchema, "doc_reviews");
