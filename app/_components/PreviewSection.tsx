"use client";

import React, { useState } from "react";
import {
  Eye,
  Copy,
  Check,
  Download,
  FileText,
  ExternalLink,
} from "lucide-react";
import StatsDisplay from "./StatsDisplay";
import { useDocsStore } from "@/app/lib/store";

export default function PreviewSection() {
  const { generatedDocs, docType } = useDocsStore();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedDocs);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const downloadMarkdown = () => {
    const blob = new Blob([generatedDocs], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${docType.toUpperCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const openInNewTab = () => {
    const blob = new Blob([generatedDocs], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-blue-500/20 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900/50 border-b border-slate-700">
          <div className="flex items-center space-x-2">
            <Eye className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">Preview</h2>
            {generatedDocs && (
              <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
                Ready
              </span>
            )}
          </div>
          {generatedDocs && (
            <div className="flex items-center space-x-2">
              <button
                onClick={copyToClipboard}
                className="flex items-center space-x-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-all hover:scale-105 active:scale-95"
                title="Copy to clipboard"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-400" />
                    <span className="text-green-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </>
                )}
              </button>
              <button
                onClick={openInNewTab}
                className="flex items-center space-x-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-all hover:scale-105 active:scale-95"
                title="Open in new tab"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="hidden sm:inline">Open</span>
              </button>
              <button
                onClick={downloadMarkdown}
                className="flex items-center space-x-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-all hover:scale-105 active:scale-95"
                title="Download markdown file"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
            </div>
          )}
        </div>

        <div className="p-6 max-h-[calc(100vh-16rem)] overflow-y-auto custom-scrollbar">
          {!generatedDocs ? (
            <div className="flex flex-col items-center justify-center h-96 text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
                <FileText className="w-16 h-16 text-slate-600 relative" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No Documentation Yet
              </h3>
              <p className="text-slate-400 max-w-md mb-6">
                Enter your repository URL, paste code, or upload files to
                generate professional documentation using Groq AI
              </p>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
                <pre className="whitespace-pre-wrap text-sm text-slate-300 font-mono leading-relaxed">
                  {generatedDocs}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>

      {generatedDocs && <StatsDisplay docs={generatedDocs} />}

      {generatedDocs && (
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-4 border border-blue-500/20">
          <h4 className="text-white font-semibold text-sm mb-2 flex items-center space-x-2">
            <svg
              className="w-4 h-4 text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Tips</span>
          </h4>
          <ul className="space-y-1 text-xs text-slate-400">
            <li>
              • Copy the markdown and paste it directly into your repository
            </li>
            <li>• Download as .md file and add it to your project root</li>
            <li>• Customize the generated content to match your needs</li>
          </ul>
        </div>
      )}
    </div>
  );
}
