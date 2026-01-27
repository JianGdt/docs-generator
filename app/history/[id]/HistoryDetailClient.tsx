"use client";

import { useState } from "react";
import { FileText, Clock, Download, Copy, Check, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DocumentPreview from "@/components/preview/DocsPreview";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { HistoryEntryClient } from "@//lib/@types/history";
import { useHistoryRefetch } from "@//hooks/useHistoryRefetch";
import { formatDate } from "@//lib/utils";
import DialogAlert from "../_components/DialogAlert";

interface HistoryDetailClientProps {
  dataHistoryById: HistoryEntryClient;
}

export default function HistoryDetailClient({
  dataHistoryById,
}: HistoryDetailClientProps) {
  const [copied, setCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useRouter();
  const { triggerRefetch } = useHistoryRefetch();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(dataHistoryById.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleDownload = () => {
    const blob = new Blob([dataHistoryById.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${dataHistoryById.title}-v${dataHistoryById.version}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/history/${dataHistoryById._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete history entry");
      }
      toast.success("History entry deleted successfully");
      triggerRefetch();
      router.push("/history");
    } catch (error) {
      console.error("Error deleting history entry:", error);
      toast.error("Failed to delete history entry");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <div className="mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-md md:text-4xl font-bold text-black dark:text-white mb-2">
                {dataHistoryById.title}
              </h1>
              <div className="flex items-center gap-3 flex-wrap">
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                  v{dataHistoryById.version}
                </Badge>
                <span className="text-sm text-black dark:text-white">
                  {dataHistoryById.documentType}
                </span>
                <span className="text-gray-400">·</span>
                <span className="text-sm text-black dark:text-white flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {formatDate(dataHistoryById.createdAt)}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="flex items-center gap-2"
                disabled={isDeleting}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="flex items-center gap-2"
                disabled={isDeleting}
              >
                <Download className="h-4 w-4" />
                Download
              </Button>

              <Button
                onClick={() => setShowDeleteDialog(true)}
                variant="destructive"
                size="sm"
                className="cursor-pointer"
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Delete</span>
              </Button>
            </div>
          </div>
        </div>

        <Separator />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Document Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DocumentPreview content={dataHistoryById.content} />
          </CardContent>
        </Card>
      </div>

      <DialogAlert
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Document"
        description={`Are you sure you want to delete "${dataHistoryById.title}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
}
