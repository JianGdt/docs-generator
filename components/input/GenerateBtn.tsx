"use client";

import { Sparkles, Loader2 } from "lucide-react";
import { useDocsStore } from "@//lib/store/useDocStore";
import { Button } from "../ui/button";
import { useDocumentGeneration } from "../../hooks/useGenerate";

export function GenerateButton() {
  const { inputMethod, githubUrl, codeInput, uploadedFiles, isGenerating } =
    useDocsStore();
  const { handleGenerate } = useDocumentGeneration();

  const isDisabled =
    isGenerating ||
    (inputMethod === "github" && !githubUrl.trim()) ||
    (inputMethod === "code" && !codeInput.trim()) ||
    (inputMethod === "upload" && uploadedFiles.length === 0);

  return (
    <Button
      onClick={handleGenerate}
      variant="outline"
      disabled={isDisabled}
      className="w-full cursor-pointer"
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Generating...</span>
        </>
      ) : (
        <>
          <Sparkles className="w-5 h-5" />
          <span>Generate Documentation</span>
        </>
      )}
    </Button>
  );
}
