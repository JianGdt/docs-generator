"use client";

import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Clock,
  FileText,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HistoryEntry {
  _id: string;
  docId: string;
  title: string;
  documentType: string;
  version: number;
  changeDescription?: string;
  createdAt: string;
}

interface HistoryResponse {
  history: HistoryEntry[];
  pagination: {
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
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchHistory();
  }, [page]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = history.filter(
        (entry) =>
          entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          entry.documentType.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredHistory(filtered);
    } else {
      setFilteredHistory(history);
    }
  }, [searchQuery, history]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/history?page=${page}&limit=20`);
      if (response.ok) {
        const data: HistoryResponse = await response.json();
        setHistory(data.history);
        setFilteredHistory(data.history);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setLoading(false);
    }
  };

  const groupedHistory = filteredHistory.reduce((acc, entry) => {
    if (!acc[entry.docId]) {
      acc[entry.docId] = [];
    }
    acc[entry.docId].push(entry);
    return acc;
  }, {} as Record<string, HistoryEntry[]>);

  if (loading && history.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-purple-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-purple-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Clock className="h-10 w-10" />
            Document History
          </h1>
          <p className="text-blue-200">
            View and manage all your document versions
          </p>
        </div>

        {/* Search */}
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <FileText className="h-6 w-6 text-green-300" />
                </div>
                <div>
                  <p className="text-sm text-white/60">Documents</p>
                  <p className="text-2xl font-bold text-white">
                    {Object.keys(groupedHistory).length}
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

        {/* History List */}
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
            {Object.entries(groupedHistory).map(([docId, entries]) => (
              <Card
                key={docId}
                className="bg-white/10 backdrop-blur-lg border-white/20"
              >
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div>
                    <CardTitle className="text-white text-xl mb-1">
                      {entries[0].title}
                    </CardTitle>
                    <p className="text-sm text-white/60">
                      {entries.length} version{entries.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <Link href={`/documents/${docId}`}>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      View Document
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="space-y-2">
                  {entries.slice(0, 3).map((entry) => (
                    <div
                      key={entry._id}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                          v{entry.version}
                        </Badge>
                        <span className="text-sm text-white/80">
                          {entry.documentType}
                        </span>
                        {entry.changeDescription && (
                          <>
                            <span className="text-white/40">·</span>
                            <span className="text-sm text-white/60">
                              {entry.changeDescription}
                            </span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-white/50">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(entry.createdAt), {
                          addSuffix: true,
                        })}
                      </div>
                    </div>
                  ))}
                  {entries.length > 3 && (
                    <p className="text-sm text-white/50 text-center pt-2">
                      + {entries.length - 3} more version
                      {entries.length - 3 !== 1 ? "s" : ""}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
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
