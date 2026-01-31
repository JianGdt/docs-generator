"use client";

import { cn } from "@//lib/utils";
import { Skeleton } from "../ui/skeleton";
import { SkeletonListProps } from "@//lib/@types/skeleton";

export function SkeletonList({
  count = 3,
  showAvatar = true,
  className,
}: SkeletonListProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          {showAvatar && <Skeleton className="h-12 w-12 rounded-full" />}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
