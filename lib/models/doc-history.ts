import mongoose, { Schema } from "mongoose";
import { IDocHistory } from "./models.types";

const DocHistorySchema = new Schema<IDocHistory>(
  {
    docId: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    documentType: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    version: {
      type: Number,
      required: true,
    },
    changeDescription: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

DocHistorySchema.index({ userId: 1, createdAt: -1 });
DocHistorySchema.index({ title: "text", documentType: "text" });

export default mongoose.models.DocHistory ||
  mongoose.model<IDocHistory>("DocHistory", DocHistorySchema, "doc_history");
