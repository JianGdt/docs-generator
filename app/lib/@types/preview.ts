import { LucideIcon } from "lucide-react";

export interface DocsStore {
  generatedDocs: string;
  docType: string;
}

export interface StatCardProps {
  value: number;
  label: string;
}

export interface PreviewHeaderProps {
  hasContent: boolean;
  onCopy: () => void;
  onOpen: () => void;
  onDownload: () => void;
  copied: boolean;
}

export interface DocumentPreviewProps {
  content: string;
}

export interface StatsDisplayProps {
  docs: string;
}

export interface StatItem {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}
