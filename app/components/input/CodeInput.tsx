"use client";

import { Sparkles } from "lucide-react";
import { useDocsStore } from "@/app/lib/store";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { InfoMessage } from "../InfoMessage";

export function CodeInput() {
  const { codeInput, setCodeInput, isGenerating } = useDocsStore();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="code-input" className="text-slate-300">
          Paste Your Code
        </Label>
        <Textarea
          id="code-input"
          value={codeInput}
          onChange={(e) => setCodeInput(e.target.value)}
          disabled={isGenerating}
          className="min-h-64 bg-slate-900 text-white border-slate-700 focus:border-blue-500 focus:ring-blue-500/50 font-mono text-sm resize-none"
          placeholder="// Paste your code here..."
        />
      </div>
      <InfoMessage
        icon={Sparkles}
        message="Paste your source code and AI will generate professional documentation based on your code structure and functionality"
      />
    </div>
  );
}
