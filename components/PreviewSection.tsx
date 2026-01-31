"use client";

import { useDocsStore } from "@//lib/store/useDocStore";
import { downloadMarkdown, openInNewTab } from "../lib/utils";
import { useCopyToClipboard } from "../hooks/useClipboard";
import PreviewHeader from "./preview/Header";
import DocumentPreview from "./preview/DocsPreview";
import { Card, CardHeader } from "./ui/card";
import { Separator } from "./ui/separator";
import EmptyState from "./EmptyState";

export default function PreviewSection() {
  const { generatedDocs, docType } = useDocsStore();
  const { copied, copy } = useCopyToClipboard();

  const handleCopy = () => copy(generatedDocs);
  const handleDownload = () =>
    downloadMarkdown(generatedDocs, docType.toUpperCase());
  const handleOpen = () => openInNewTab(generatedDocs);

  return (
    <>
      <Card className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
        <CardHeader>
          <PreviewHeader
            hasContent={!!generatedDocs}
            onCopy={handleCopy}
            onOpen={handleOpen}
            onDownload={handleDownload}
            copied={copied}
          />
          <Separator />
        </CardHeader>

        <div className="md:p-6 p-3 max-h-[calc(100vh-16rem)] overflow-y-auto">
          {!generatedDocs ? (
            <EmptyState type="preview" />
          ) : (
            <DocumentPreview content={generatedDocs} />
          )}
        </div>
      </Card>
    </>
  );
}
