"use client";

import { useDocsStore } from "@/app/lib/store";
import { downloadMarkdown, openInNewTab } from "../lib/utils";
import { useCopyToClipboard } from "../hooks/useClipboard";
import PreviewHeader from "./preview/Header";
import EmptyState from "./preview/EmptyState";
import DocumentPreview from "./preview/DocsPreview";

export default function PreviewSection() {
  const { generatedDocs, docType } = useDocsStore();
  const { copied, copy } = useCopyToClipboard();

  const handleCopy = () => copy(generatedDocs);
  const handleDownload = () =>
    downloadMarkdown(generatedDocs, docType.toUpperCase());
  const handleOpen = () => openInNewTab(generatedDocs);

  return (
    <>
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl  shadow-2xl border border-white/20 overflow-hidden">
        <PreviewHeader
          hasContent={!!generatedDocs}
          onCopy={handleCopy}
          onOpen={handleOpen}
          onDownload={handleDownload}
          copied={copied}
        />

        <div className="md:p-6 p-3 max-h-[calc(100vh-16rem)] overflow-y-auto">
          {!generatedDocs ? (
            <EmptyState />
          ) : (
            <DocumentPreview content={generatedDocs} />
          )}
        </div>
      </div>
    </>
  );
}
