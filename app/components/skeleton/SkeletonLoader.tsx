"use client";

import { SkeletonLoaderProps } from "@//lib/@types/skeleton";
import { SkeletonCard } from "./SkeletonCard";
import { SkeletonList } from "./SkeletonLists";
import { SkeletonText } from "./SkeletonText";
import { SkeletonPreview } from "./SkeletonPrev";
import { SkeletonStats } from "./SkeletonStats";

export function SkeletonLoader({
  variant = "card",
  count = 1,
  className,
  rows,
  columns,
  showHeader = true,
}: SkeletonLoaderProps) {
  const renderSkeleton = () => {
    switch (variant) {
      case "card":
        return Array.from({ length: count }).map((_, i) => (
          <SkeletonCard key={i} className={className} />
        ));
      case "list":
        return <SkeletonList count={count} className={className} />;
      case "text":
        return <SkeletonText lines={count} className={className} />;
      case "preview":
        return <SkeletonPreview className={className} />;
      case "stats":
        return <SkeletonStats count={count} className={className} />;
      default:
        return <SkeletonCard className={className} />;
    }
  };

  return <>{renderSkeleton()}</>;
}
