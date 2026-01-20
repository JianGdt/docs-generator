"use client";

import { FileText } from "lucide-react";

export default function DescriptionSection() {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center space-x-3 mb-4">
        <FileText className="w-8 h-8 text-white" />
        <h1 className="text-3xl font-bold text-white">AI Docs Generator</h1>
      </div>
      <p className="text-slate-400">
        I built an AI Docs Generator that helps developers create documentation
        faster.
      </p>
    </div>
  );
}
