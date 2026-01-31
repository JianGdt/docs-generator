"use client";
import EmptyState from "../../../components/EmptyState";
import { DocumentCard } from "./DocumentCard";
import { DocHistoryEntryClient } from "@//lib/@types/history";

interface DocumentListProps {
  documents: DocHistoryEntryClient[];
  searchQuery: string;
}

export function DocumentList({ documents, searchQuery }: DocumentListProps) {
  if (documents.length === 0) {
    return <EmptyState type="history" searchQuery={searchQuery || undefined} />;
  }

  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <DocumentCard key={doc._id?.toString()} document={doc} />
      ))}
    </div>
  );
}
