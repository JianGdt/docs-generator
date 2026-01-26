"use client";

import { Button } from "@/components/ui/button";
import { Clock, FileText, Loader2, FolderGit2 } from "lucide-react";
import { LucideIcon } from "lucide-react";

type EmptyStateType = "preview" | "docsgen" | "history";

interface EmptyStateConfig {
  icon: LucideIcon;
  title: string;
  description: string;
  showGlow?: boolean;
}

interface EmptyStateProps {
  type: EmptyStateType;
  loading?: boolean;
  searchQuery?: string;
  onRetry?: () => void;
}

const emptyStateConfigs: Record<EmptyStateType, EmptyStateConfig> = {
  preview: {
    icon: FileText,
    title: "No Documentation Yet",
    description:
      "Enter your repository URL, paste code, or upload files to generate professional documentation using Groq AI",
    showGlow: true,
  },
  docsgen: {
    icon: FolderGit2,
    title: "No repositories found",
    description: "Unable to load repositories. Please try again.",
    showGlow: false,
  },
  history: {
    icon: Clock,
    title: "No History Yet",
    description: "Your document history will appear here",
    showGlow: true,
  },
};

export default function EmptyState({
  type,
  loading = false,
  searchQuery,
  onRetry,
}: EmptyStateProps) {
  if (loading && type === "docsgen") {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
        <span className="ml-2 text-black dark:text-white">
          Loading repositories...
        </span>
      </div>
    );
  }

  const config = emptyStateConfigs[type];
  const Icon = config.icon;

  const title =
    searchQuery && type === "history"
      ? "No matching documents found"
      : config.title;

  const description =
    searchQuery && type === "history"
      ? "Try adjusting your search terms"
      : config.description;

  return (
    <div className="flex flex-col items-center justify-center h-96 text-center px-4">
      <div className="relative mb-6">
        {config.showGlow && (
          <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
        )}
        <Icon
          className={`relative ${
            type === "preview"
              ? "w-16 h-16 text-slate-600"
              : "w-12 h-12 text-slate-500"
          }`}
        />
      </div>

      <h3 className="text-sm md:text-xl font-semibold text-white mb-2">
        {title}
      </h3>

      <p className="text-slate-400 max-w-md mb-4">{description}</p>

      {type === "docsgen" && onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">
          Retry
        </Button>
      )}
    </div>
  );
}
