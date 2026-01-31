import mongoose, { Schema, Document } from "mongoose";
import { IUploadedFile } from "./models.types";

const UploadedFileSchema = new Schema<IUploadedFile>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    filename: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

UploadedFileSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.UploadedFile ||
  mongoose.model<IUploadedFile>(
    "UploadedFile",
    UploadedFileSchema,
    "uploaded_files",
  );
