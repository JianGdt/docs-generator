"use client";

import axios from "axios";
import { useDocsStore } from "@/app/lib/store";

export function useDocumentGeneration() {
  const {
    inputMethod,
    githubUrl,
    codeInput,
    uploadedFiles,
    docType,
    setIsGenerating,
    setError,
    setGeneratedDocs,
  } = useDocsStore();

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      let data = "";

      if (inputMethod === "github") data = githubUrl;
      else if (inputMethod === "code") data = codeInput;
      else if (inputMethod === "upload") {
        data = uploadedFiles
          .map((file) => `// File: ${file.fileName}\n${file.content}`)
          .join("\n\n");
      }

      if (!data.trim()) throw new Error("Please provide input data");

      const response = await axios.post(
        "/api/generate",
        { method: inputMethod, data, docType },
        { withCredentials: true },
      );

      setGeneratedDocs(response.data.documentation);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError("You must be logged in to generate documentation.");
        return;
      }

      setError(err.response?.data?.error || err.message || "An error occurred");
      console.error("Error generating docs:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return { handleGenerate };
}
