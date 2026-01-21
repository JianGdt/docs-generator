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

      if (inputMethod === "github") {
        data = githubUrl;
      } else if (inputMethod === "code") {
        data = codeInput;
      } else if (inputMethod === "upload") {
        data = uploadedFiles
          .map((file) => `// File: ${file.fileName}\n${file.content}`)
          .join("\n\n");
      }

      if (!data.trim()) {
        throw new Error("Please provide input data");
      }

      const response = await axios.post("/api/generate", {
        method: inputMethod,
        data,
        docType,
      });

      if (response.data.success) {
        await fetch("/api/docs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: `My Doc - ${docType}`,
            content: data,
            docType: docType,
            repositoryUrl: githubUrl,
          }),
        });

        setGeneratedDocs(response.data.documentation);
      } else {
        throw new Error(response.data.error || "Generation failed");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error || err.message || "An error occurred";
      setError(errorMessage);
      console.error("Error generating docs:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return { handleGenerate };
}
