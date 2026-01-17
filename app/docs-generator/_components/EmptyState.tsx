"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2 } from "lucide-react";

interface EmptyStateProps {
  loading?: boolean;
  onRetry: () => void;
}

export function EmptyState({ loading, onRetry }: EmptyStateProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
        <span className="ml-2 text-slate-300">Loading repositories...</span>
      </div>
    );
  }

  return (
    <div className="text-center py-8">
      <AlertCircle className="w-12 h-12 text-slate-500 mx-auto mb-3" />
      <p className="text-slate-300 mb-4">No repositories found</p>
      <Button onClick={onRetry} variant="outline" size="sm">
        Retry
      </Button>
    </div>
  );
}
