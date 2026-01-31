"use client";

import { Skeleton } from "../ui/skeleton";
import { cn } from "@//lib/utils";

interface SkeletonPreviewProps {
  className?: string;
}

export function SkeletonPreview({ className }: SkeletonPreviewProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl w-[350px] md:w-full shadow-2xl border border-blue-500/20 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900/50 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-5 w-24" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-28" />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    </div>
  );
}
