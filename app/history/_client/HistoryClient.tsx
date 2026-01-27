"use client";

import { useEffect } from "react";
import { PageHeader } from "../_components/PageHeader";
import { SearchBar } from "../_components/SearchBar";
import { StatsGrid } from "../_components/StatsGrid";
import { DocumentList } from "../_components/DocumentList";
import { HistoryPagination } from "../_components/HistoryPagination";
import { HistoryClientProps } from "@//lib/@types/history";
import { useHistoryStore } from "@//hooks/history/useHistoryStore";
import { useHistoryNavigation } from "@//hooks/history/useHistoryNavigation";

export default function HistoryClient({
  initialData,
  initialPagination,
  initialPage,
  initialSearch,
}: HistoryClientProps) {
  const {
    documents,
    pagination,
    searchQuery,
    currentPage,
    setDocuments,
    setPagination,
    setSearchQuery,
    setCurrentPage,
  } = useHistoryStore();

  const { handleSearch, handlePageChange, handleRefresh, isPending } =
    useHistoryNavigation();

  useEffect(() => {
    setDocuments(initialData);
    setPagination(initialPagination);
    setSearchQuery(initialSearch);
    setCurrentPage(initialPage);
  }, [
    initialData,
    initialPagination,
    initialSearch,
    initialPage,
    setDocuments,
    setPagination,
    setSearchQuery,
    setCurrentPage,
  ]);

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
      <PageHeader onRefresh={handleRefresh} isRefreshing={isPending} />
      <div className="mb-6">
        <SearchBar value={searchQuery} onChange={handleSearch} />
      </div>

      <StatsGrid
        totalDocuments={pagination.total}
        lastUpdated={documents?.[0]?.createdAt.toString() || ""}
      />

      <DocumentList documents={documents} searchQuery={searchQuery} />

      <HistoryPagination
        currentPage={currentPage}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
