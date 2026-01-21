"use client";

import { useState, useEffect, useCallback } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Clock,
  FileText,
  Search,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useHistoryRefetch } from "@//hooks/useHistoryRefetch";
import BreadcumbLayout from "../components/layout/Breadcrumb";
import { SkeletonList } from "../components/skeleton/SkeletonLists";

interface HistoryEntry {
  _id: string;
  userId: string;
  title: string;
  docType: string;
  version: number;
  changeDescription?: string;
  createdAt: string;
  updatedAt: string;
}

interface HistoryResponse {
  documents: HistoryEntry[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const { refetchTrigger } = useHistoryRefetch();

  const fetchHistory = useCallback(
    async (showLoader = true) => {
      try {
        if (showLoader) {
          setLoading(true);
        } else {
          setRefreshing(true);
        }

        const response = await fetch(`/api/docs?page=${page}&limit=20`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
          },
        });

        if (response.ok) {
          const data: HistoryResponse = await response.json();
          const docs = data.documents || [];
          setHistory(docs);
          setFilteredHistory(docs);

          // Handle pagination if it exists, otherwise use defaults
          if (data.pagination) {
            setPagination(data.pagination);
          } else {
            setPagination({
              page: 1,
              limit: 20,
              total: docs.length,
              totalPages: 1,
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch history:", error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [page],
  );

  useEffect(() => {
    fetchHistory(true);
  }, [page, fetchHistory]);

  useEffect(() => {
    if (refetchTrigger > 0) {
      const timeoutId = setTimeout(() => {
        fetchHistory(false);
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [refetchTrigger, fetchHistory]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = history.filter(
        (entry) =>
          entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          entry.docType.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredHistory(filtered);
    } else {
      setFilteredHistory(history);
    }
  }, [searchQuery, history]);

  const handleManualRefresh = () => {
    fetchHistory(false);
  };

  // Group history entries by _id (each document gets its own card)
  // Then sort by most recent first
  const sortedHistory = [...filteredHistory].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );

  // Create a grouped structure where each document is its own group
  const groupedHistory =
    sortedHistory.reduce(
      (acc, entry) => {
        const key = entry._id;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(entry);
        return acc;
      },
      {} as Record<string, HistoryEntry[]>,
    ) || {};

  if (loading && history.length === 0) {
    return <SkeletonList />;
  }

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <Clock className="h-10 w-10" />
                Document History
              </h1>
              <p className="text-blue-200">
                View and manage all your document versions
              </p>
            </div>
            <Button
              onClick={handleManualRefresh}
              disabled={refreshing}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
              />
              {refreshing ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
            <Input
              type="text"
              placeholder="Search by title or document type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:bg-white/15"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-300" />
                </div>
                <div>
                  <p className="text-sm text-white/60">Total Versions</p>
                  <p className="text-2xl font-bold text-white">
                    {pagination.total}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <Clock className="h-6 w-6 text-purple-300" />
                </div>
                <div>
                  <p className="text-sm text-white/60">Last Updated</p>
                  <p className="text-sm font-medium text-white">
                    {history.length > 0
                      ? formatDistanceToNow(new Date(history[0].createdAt), {
                          addSuffix: true,
                        })
                      : "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {filteredHistory.length === 0 ? (
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-12 text-center">
              <Clock className="mx-auto h-16 w-16 text-white/40 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                {searchQuery ? "No matching history found" : "No History Yet"}
              </h3>
              <p className="text-white/60">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : "Your document version history will appear here"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedHistory).map(([docId, entries]) => {
              const doc = entries[0]; // Get the first (and only) entry
              return (
                <Card
                  key={docId}
                  className="bg-white/10 backdrop-blur-lg border-white/20"
                >
                  <CardHeader className="flex flex-row items-start justify-between space-y-0">
                    <div className="flex-1">
                      <CardTitle className="text-white text-xl mb-2">
                        {doc.title}
                      </CardTitle>
                      <div className="flex items-center gap-3 flex-wrap">
                        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                          v{doc.version}
                        </Badge>
                        <span className="text-sm text-white/60">
                          {doc.docType}
                        </span>
                        {doc.changeDescription && (
                          <>
                            <span className="text-white/40">·</span>
                            <span className="text-sm text-white/60">
                              {doc.changeDescription}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <Link href={`/history/${doc._id}`}>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        View Document
                      </Button>
                    </Link>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        )}

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <span className="text-sm text-white/80">
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <Button
              onClick={() => setPage(page + 1)}
              disabled={page === pagination.totalPages}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
