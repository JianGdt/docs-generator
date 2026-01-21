"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonCardProps } from "@//lib/@types/skeleton";
import { cn } from "@//lib/utils";

export function SkeletonCard({
  showImage = true,
  showDescription = true,
  imageAspect = "video",
  className,
}: SkeletonCardProps) {
  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    wide: "aspect-[21/9]",
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <Skeleton className="h-5 w-2/3" />
        {showDescription && <Skeleton className="h-4 w-1/2" />}
      </CardHeader>
      <CardContent>
        {showImage && (
          <Skeleton className={cn("w-full", aspectClasses[imageAspect])} />
        )}
      </CardContent>
    </Card>
  );
}
