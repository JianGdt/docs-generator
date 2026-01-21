"use client";

import { Eye, Copy, Check, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PreviewHeaderProps } from "@//lib/@types/preview";

export default function PreviewHeader({
  hasContent,
  onCopy,
  onOpen,
  onDownload,
  copied,
}: PreviewHeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-slate-900/50 border-b border-slate-700">
      <div className="flex items-center gap-2">
        <Eye className="w-5 h-5 text-blue-400" />
        <h2 className="text-lg font-semibold text-white">Preview</h2>
        {hasContent && (
          <Badge
            variant="outline"
            className="bg-green-500/20 text-green-400 border-green-500/30"
          >
            Ready
          </Badge>
        )}
      </div>

      {hasContent && (
        <div className="flex items-center gap-2">
          <Button
            onClick={onCopy}
            variant="secondary"
            size="sm"
            className="bg-slate-700 hover:bg-slate-600"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-400" />
                <span className="ml-1 text-green-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span className="ml-1">Copy</span>
              </>
            )}
          </Button>

          <Button
            onClick={onOpen}
            variant="secondary"
            size="sm"
            className="bg-slate-700 hover:bg-slate-600"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="ml-1 hidden sm:inline">Open</span>
          </Button>

          <Button
            onClick={onDownload}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Download className="w-4 h-4" />
            <span className="ml-1">Download</span>
          </Button>
        </div>
      )}
    </div>
  );
}
