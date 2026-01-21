"use client";

import { useState } from "react";
import axios from "axios";
import { useDocsStore } from "@/app/lib/store";

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

      const response = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setUploadedFiles(response.data.files);
      } else {
        throw new Error(response.data.error || "Upload failed");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error || err.message || "Upload failed";
      setError(errorMessage);
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  return { isUploading, handleFileUpload };
}
