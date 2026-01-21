"use client";

import { Sparkles, Loader2 } from "lucide-react";
import { useDocsStore } from "@/app/lib/store";
import { Button } from "@/components/ui/button";
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
      disabled={isDisabled}
      className="w-full mt-6 flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 hover:scale-[1.02] active:scale-[0.98] transition-all"
      size="lg"
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Generating with Groq AI...</span>
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
