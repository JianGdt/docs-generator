"use client";

import { Clock, RefreshCw } from "lucide-react";
import { Button } from "../../../components/ui/button";

interface PageHeaderProps {
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export function PageHeader({
  onRefresh,
  isRefreshing = false,
}: PageHeaderProps) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-sm md:text-4xl font-bold text-black dark:text-white mb-2 flex items-center gap-3">
          <Clock className="md:h-10 md:w-10 w-4 h-4" />
          Document History
        </h1>
        <p className="text-gray-500 dark:text-white text-sm md:text-md">
          View and manage all your document versions
        </p>
      </div>
      <Button onClick={onRefresh} disabled={isRefreshing} variant="outline">
        <RefreshCw
          className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
        />
        {isRefreshing ? "Refreshing..." : "Refresh"}
      </Button>
    </div>
  );
}
