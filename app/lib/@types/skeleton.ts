export type SkeletonVariant =
  | "card"
  | "list"
  | "text"
  | "avatar"
  | "table"
  | "preview"
  | "stats";

export interface SkeletonLoaderProps {
  variant?: SkeletonVariant;
  count?: number;
  className?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  rows?: number;
  columns?: number;
}

export interface SkeletonCardProps {
  showImage?: boolean;
  showDescription?: boolean;
  imageAspect?: "square" | "video" | "wide";
  className?: string;
}

export interface SkeletonListProps {
  count?: number;
  showAvatar?: boolean;
  className?: string;
}

export interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

export interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  className?: string;
}
