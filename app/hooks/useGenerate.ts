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

  const getInputData = () => {
    if (inputMethod === "github") return githubUrl;
    if (inputMethod === "code") return codeInput;
    return uploadedFiles
      .map((file) => `// File: ${file.fileName}\n${file.content}`)
      .join("\n\n");
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const data = getInputData();
      
      if (!data.trim()) {
        throw new Error("Please provide input data");
      }

      const response = await axios.post("/api/generate", {
        method: inputMethod,
        data,
        docType,
      });

      if (!response.data.success) {
        throw new Error(response.data.error || "Generation failed");
      }

      await fetch("/api/docs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `My Doc - ${docType}`,
          content: data,
          docType,
          repositoryUrl: githubUrl,
        }),
      });

      setGeneratedDocs(response.data.documentation);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "An error occurred");
      console.error("Error generating docs:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return { handleGenerate };
}