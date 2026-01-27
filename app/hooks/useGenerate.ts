"use client";

import axios from "axios";
import { useDocsStore } from "@//lib/store/useDocStore";

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
      if (!data.trim()) throw new Error("Please provide input data");

      // Generate documentation
      const { data: generateResponse } = await axios.post("/api/generate", {
        method: inputMethod,
        data,
        docType,
      });

      if (!generateResponse.success) {
        throw new Error(generateResponse.error || "Generation failed");
      }

      const { documentation, metadata = {} } = generateResponse;
      const title = metadata.name
        ? `${metadata.name} - ${docType}`
        : `My Doc - ${docType}`;

      await axios.post("/api/docs", {
        title,
        content: documentation,
        docType,
        repositoryUrl:
          metadata.url || (inputMethod === "github" ? githubUrl : undefined),
        repositoryName: metadata.name,
      });

      setGeneratedDocs(documentation);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "An error occurred");
      console.error("Error generating docs:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return { handleGenerate };
}
