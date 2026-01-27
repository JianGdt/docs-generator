"use client";

import { Sparkles } from "lucide-react";
import { useDocsStore } from "@//lib/store/useDocStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InfoMessage } from "../InfoMessage";

export function GithubInput() {
  const { githubUrl, setGithubUrl, isGenerating } = useDocsStore();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="github-url" className="text-black dark:text-white">
          GitHub Repository URL
        </Label>
        <Input
          id="github-url"
          type="text"
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
          placeholder="https://github.com/username/repository"
          disabled={isGenerating}
        />
      </div>
      <InfoMessage
        icon={Sparkles}
        message="AI will analyze your repository structure, code, and generate comprehensive documentation"
      />
    </div>
  );
}
