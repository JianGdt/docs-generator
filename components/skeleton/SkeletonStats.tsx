"use client";

import { Skeleton } from "../ui/skeleton";
import { cn } from "@//lib/utils";

interface SkeletonStatsProps {
  count?: number;
  className?: string;
}

export function SkeletonStats({ count = 3, className }: SkeletonStatsProps) {
  return (
    <div className={cn("grid grid-cols-3 gap-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-slate-800/30 backdrop-blur-sm rounded-lg p-4 border border-blue-500/10"
        >
          <div className="flex flex-col items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-7 w-16" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      ))}
    </div>
  );
}
