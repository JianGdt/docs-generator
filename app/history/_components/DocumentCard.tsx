"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { DocHistoryEntryClient } from "@//lib/@types/history";
import { formatDateHistory } from "@//lib/utils";

interface DocumentCardProps {
  document: DocHistoryEntryClient;
}

export function DocumentCard({ document }: DocumentCardProps) {
  return (
    <Card className="transition-colors hover:bg-accent/5">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="flex-1">
          <CardTitle className="text-black dark:text-white text-xl mb-2">
            {document.title}
          </CardTitle>
          <div className="flex items-center gap-3 flex-wrap">
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
              v{document.version}
            </Badge>
            <span className="text-sm text-black dark:text-white">
              {document.documentType}
            </span>
            <span className="text-white/40">·</span>
            <span className="text-sm text-black dark:text-white">
              {formatDateHistory(document?.createdAt)}
            </span>
            {document.changeDescription && (
              <>
                <span className="text-white/40">·</span>
                <span className="text-sm text-black dark:text-white">
                  {document.changeDescription}
                </span>
              </>
            )}
          </div>
        </div>
        <Link href={`/history/${document._id}`}>
          <Button variant="default" size="sm" className="cursor-pointer">
            View
          </Button>
        </Link>
      </CardHeader>
    </Card>
  );
}
