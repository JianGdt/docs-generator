"use client";

import { useState, useEffect } from "react";
import { Clock, FileText, Search, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useHistoryRefetch } from "@//hooks/useHistoryRefetch";
import { SkeletonCard } from "../components/skeleton/SkeletonCard";
import { HistoryEntry, HistoryResponse } from "../lib/@types/history";

const ITEMS_PER_PAGE = 5;

export default function HistoryPage() {
  const [data, setData] = useState<HistoryEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { refetchTrigger } = useHistoryRefetch();

  const fetchHistory = async (showLoader = true) => {
    try {
      showLoader ? setLoading(true) : setRefreshing(true);

      const res = await fetch(
        `/api/docs?page=${currentPage}&limit=${ITEMS_PER_PAGE}`,
        {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
        },
      );

      if (res.ok) {
        const result: HistoryResponse = await res.json();
        setData(result.documents.data || []);
        setPagination({
          page: result.documents.page,
          limit: result.documents.limit,
          total: result.documents.total,
          totalPages: result.documents.totalPages,
        });
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [currentPage]);

  useEffect(() => {
    if (refetchTrigger > 0) {
      const timeout = setTimeout(() => fetchHistory(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [refetchTrigger]);

  const filteredData = searchQuery.trim()
    ? data.filter(
        (entry) =>
          entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          entry.docType.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : data;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const diffHours = (Date.now() - date.getTime()) / (1000 * 60 * 60);

    if (diffHours < 24) return "Today";
    if (diffHours < 48) return "Yesterday";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const renderPaginationItems = () => {
    return [...Array(pagination.totalPages)].map((_, i) => {
      const page = i + 1;
      const isVisible =
        page === 1 ||
        page === pagination.totalPages ||
        Math.abs(page - currentPage) <= 1;
      const isEllipsis = Math.abs(page - currentPage) === 2;

      if (isVisible) {
        return (
          <PaginationItem key={page}>
            <PaginationLink
              onClick={() => setCurrentPage(page)}
              isActive={currentPage === page}
              className="cursor-pointer"
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (isEllipsis) {
        return (
          <PaginationItem key={page}>
            <span className="px-4">...</span>
          </PaginationItem>
        );
      }

      return null;
    });
  };

  if (loading && data.length === 0) return <SkeletonCard />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className=" text-sm md:text-4xl font-bold text-black dark:text-white mb-2 flex items-center gap-3">
            <Clock className="md:h-10 md:w-10 w-4 h-4" />
            Document History
          </h1>
          <p className="text-gray-500 dark:text-white text-sm md:text-md">
            View and manage all your document versions
          </p>
        </div>
        <Button
          onClick={() => fetchHistory(false)}
          disabled={refreshing}
          variant="outline"
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
          />
          {refreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-black dark:text-white" />
        <Input
          type="text"
          placeholder="Search by title or document type..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 text-black dark:text-white placeholder:text-white/40 "
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card>
          <CardContent className="px-2 md:p-6 flex items-center gap-3">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <FileText className="h-6 w-6 text-blue-300" />
            </div>
            <div>
              <p className="text-sm text-black dark:text-white">
                Total Documents
              </p>
              <p className="text-2xl font-bold text-black dark:text-white">
                {pagination.total}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="px-2 md:p-6 flex items-center gap-3">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Clock className="h-6 w-6 text-purple-300" />
            </div>
            <div>
              <p className="text-sm text-black dark:text-white">Last Updated</p>
              <p className="text-sm font-medium text-white">
                {data[0] ? formatDate(data[0].createdAt) : "N/A"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {filteredData.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Clock className="mx-auto h-16 w-16 text-white/40 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              {searchQuery ? "No matching documents found" : "No History Yet"}
            </h3>
            <p className="text-black dark:text-white">
              {searchQuery
                ? "Try adjusting your search terms"
                : "Your document history will appear here"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            {filteredData.map((doc) => (
              <Card key={doc._id} className="transition-colors">
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div className="flex-1">
                    <CardTitle className="text-black dark:text-white text-xl mb-2">
                      {doc.title}
                    </CardTitle>
                    <div className="flex items-center gap-3 flex-wrap">
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                        v{doc.version}
                      </Badge>
                      <span className="text-sm text-black dark:text-white">
                        {doc.docType}
                      </span>
                      <span className="text-white/40">·</span>
                      <span className="text-sm text-black dark:text-white">
                        {formatDate(doc.createdAt)}
                      </span>
                      {doc.changeDescription && (
                        <>
                          <span className="text-white/40">·</span>
                          <span className="text-sm text-black dark:text-white">
                            {doc.changeDescription}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <Link href={`/history/${doc._id}`}>
                    <Button className="px-2 py-0.5 text-xs rounded-md border">
                      View Details
                    </Button>
                  </Link>
                </CardHeader>
              </Card>
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                  {renderPaginationItems()}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage((p) =>
                          Math.min(pagination.totalPages, p + 1),
                        )
                      }
                      className={
                        currentPage === pagination.totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
}
