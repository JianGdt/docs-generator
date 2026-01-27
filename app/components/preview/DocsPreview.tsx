"use client";

import type { DocumentPreviewProps } from "@//lib/@types/preview";

export default function DocumentPreview({ content }: DocumentPreviewProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="rounded-lg p-3 md:p-6 border">
        <pre className="whitespace-pre-wrap text-ellipsis overflow-hidden text-sm leading-relaxed">
          {content}
        </pre>
      </div>
    </div>
  );
}
