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
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-2">
        <Eye className="hidden md:flex w-5 h-5 text-blue-400" />
        <h2 className="text-sm md:text-xl font-semibold text-black dark:text-white">Preview</h2>
        {hasContent && (
          <Badge
            variant="outline"
            className=" text-xs md:text-md text-green-400"
          >
            Ready
          </Badge>
        )}
      </div>

      {hasContent && (
        <div className="flex items-center gap-2">
          <Button
            onClick={onCopy}
            variant="ghost"
            size="sm"
          >
            {copied ? (
              <>
                <Check className="hidden md:flex w-4 h-4 text-green-400" />
                <span className="ml-1 text-green-400 text-xs md:text-md">
                  Copied!
                </span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 hidden md:flex" />
                <span className="ml-1 text-xs md:text-md">Copy</span>
              </>
            )}
          </Button>

          <Button
            onClick={onOpen}
            variant="ghost"
            size="sm"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="ml-1 hidden text-xs md:text-md sm:inline">
              Open
            </span>
          </Button>

          <Button
            onClick={onDownload}
            size="sm"
          >
            <Download className="hidden md:flex w-4 h-4" />
            <span className="ml-0 md:ml-1 text-xs md:text-md">Download</span>
          </Button>
        </div>
      )}
    </div>
  );
}
