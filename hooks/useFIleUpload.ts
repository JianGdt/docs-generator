"use client";

import { useState } from "react";
import { useDocsStore } from "../lib/store/useDocStore";
import { endpoints } from "../lib/api/endpoints";

export function useFileUpload() {
  const { setUploadedFiles, setError } = useDocsStore();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append("files", file);
      });

      const response = await endpoints.uploadFiles(formData);

      if (!response.success || !response.data) {
        throw new Error(response.error?.message || "Upload failed");
      }

      setUploadedFiles(response.data.files);
    } catch (err: any) {
      const errorMessage = err.message || "Upload failed";
      setError(errorMessage);
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  return { isUploading, handleFileUpload };
}
