"use client";

import { endpoints } from "../lib/api/endpoints";
import { useDocsStore } from "../lib/store/useDocStore";

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

      const generateResponse = await endpoints.generateDocs({
        method: inputMethod,
        data,
        docType,
      });

      if (!generateResponse.success || !generateResponse.data) {
        throw new Error(generateResponse.error?.message || "Generation failed");
      }

      const { documentation, metadata = {} } = generateResponse.data;
      const title = metadata.name
        ? `${metadata.name} - ${docType}`
        : `My Doc - ${docType}`;

      const saveResponse = await endpoints.saveDocs({
        title,
        content: documentation,
        docType,
        repositoryUrl:
          metadata.url || (inputMethod === "github" ? githubUrl : undefined),
        repositoryName: metadata.name,
      });

      if (!saveResponse.success) {
        throw new Error(
          saveResponse.error?.message || "Failed to save document",
        );
      }

      setGeneratedDocs(documentation);
    } catch (err: any) {
      setError(err.message || "An error occurred");
      console.error("Error generating docs:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return { handleGenerate };
}
