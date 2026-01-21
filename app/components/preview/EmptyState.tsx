"use client";

import { FileText } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-96 text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
        <FileText className="w-16 h-16 text-slate-600 relative" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">
        No Documentation Yet
      </h3>
      <p className="text-slate-400 max-w-md">
        Enter your repository URL, paste code, or upload files to generate
        professional documentation using Groq AI
      </p>
    </div>
  );
}
