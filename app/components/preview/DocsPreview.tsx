"use client";

import type { DocumentPreviewProps } from "@//lib/@types/preview";

export default function DocumentPreview({ content }: DocumentPreviewProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-slate-900/50 rounded-lg p-3 md:p-6 border border-slate-700">
        <pre className="whitespace-pre-wrap text-sm text-slate-300 font-mono leading-relaxed">
          {content}
        </pre>
      </div>
    </div>
  );
}
