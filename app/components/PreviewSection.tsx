"use client";

import { useDocsStore } from "@/app/lib/store";
import { downloadMarkdown, openInNewTab } from "../lib/utils";
import { useCopyToClipboard } from "../hooks/useClipboard";
import PreviewHeader from "./preview/Header";
import EmptyState from "./preview/EmptyState";
import DocumentPreview from "./preview/DocsPreview";
import StatsDisplay from "./StatsDisplay";
import TipsAlert from "./preview/Alert";

export default function PreviewSection() {
  const { generatedDocs, docType } = useDocsStore();
  const { copied, copy } = useCopyToClipboard();

  const handleCopy = () => copy(generatedDocs);
  const handleDownload = () =>
    downloadMarkdown(generatedDocs, docType.toUpperCase());
  const handleOpen = () => openInNewTab(generatedDocs);

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-blue-500/20 overflow-hidden">
        <PreviewHeader
          hasContent={!!generatedDocs}
          onCopy={handleCopy}
          onOpen={handleOpen}
          onDownload={handleDownload}
          copied={copied}
        />

        <div className="p-6 max-h-[calc(100vh-16rem)] overflow-y-auto">
          {!generatedDocs ? (
            <EmptyState />
          ) : (
            <DocumentPreview content={generatedDocs} />
          )}
        </div>
      </div>

      {generatedDocs && (
        <>
          <StatsDisplay docs={generatedDocs} />
          <TipsAlert />
        </>
      )}
    </div>
  );
}
