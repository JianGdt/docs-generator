import mongoose, { Schema } from "mongoose";
import { ISavedDoc } from "./models.types";

const SavedDocSchema = new Schema<ISavedDoc>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    docType: {
      type: String,
      required: true,
    },
    version: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  },
);

SavedDocSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.SavedDoc ||
  mongoose.model<ISavedDoc>("SavedDoc", SavedDocSchema, "docs");
