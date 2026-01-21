"use client";

import { Sparkles } from "lucide-react";
import { useDocsStore } from "@/app/lib/store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InfoMessage } from "../InfoMessage";

export function GithubInput() {
  const { githubUrl, setGithubUrl, isGenerating } = useDocsStore();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="github-url" className="text-slate-300">
          GitHub Repository URL
        </Label>
        <Input
          id="github-url"
          type="text"
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
          placeholder="https://github.com/username/repository"
          disabled={isGenerating}
          className="bg-slate-900 text-white border-slate-700 focus:border-blue-500 focus:ring-blue-500/50"
        />
      </div>
      <InfoMessage
        icon={Sparkles}
        message="AI will analyze your repository structure, code, and generate comprehensive documentation"
      />
    </div>
  );
}
