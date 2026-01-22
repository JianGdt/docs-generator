"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FileText,
  Clock,
  ArrowLeft,
  Download,
  Edit,
  History,
  Trash2,
  Save,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { formatDate } from "@//lib/utils";
import { useHistoryRefetch } from "@//hooks/useHistoryRefetch";
import { SkeletonList } from "@//components/skeleton/SkeletonLists";

interface Document {
  _id: string;
  title: string;
  docType: string;
  content: string;
  version: number;
  createdAt?: string;
  updatedAt?: string;
  userId: string;
}

export default function DocumentPage() {
  const params = useParams();
  const router = useRouter();
  const docId = params.docId as string;
  const { triggerRefetch } = useHistoryRefetch();

  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    title: "",
    documentType: "",
    content: "",
    changeDescription: "",
  });

  useEffect(() => {
    fetchDocument();
  }, [docId]);

  const fetchDocument = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/docs/${docId}`);

      if (response.status === 401) {
        toast.error("Please sign in to view this document");
        router.push("/");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch document");
      }

      const data = await response.json();
      setDocument(data);
      setEditForm({
        title: data.title,
        documentType: data.docType,
        content: data.content,
        changeDescription: "",
      });
    } catch (error) {
      console.error("Error fetching document:", error);
      toast.error("Failed to load document");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (document) {
      setEditForm({
        title: document.title,
        documentType: document.docType,
        content: document.content,
        changeDescription: "",
      });
    }
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!document) return;

    try {
      setIsSaving(true);

      const response = await fetch(`/api/docs/${docId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        throw new Error("Failed to update document");
      }

      const result = await response.json();

      toast.success("Document updated successfully");

      setDocument(result.document);
      setIsEditing(false);
      setEditForm((prev) => ({ ...prev, changeDescription: "" }));

      // Trigger history refetch after successful save
      triggerRefetch();
    } catch (error) {
      console.error("Error updating document:", error);
      toast.error("Failed to update document");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      const response = await fetch(`/api/docs/${docId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete document");
      }

      toast.success("Document deleted successfully");

      // Trigger history refetch after deletion
      triggerRefetch();

      router.push("/history");
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Failed to delete document");
      setIsDeleting(false);
    }
  };

  const handleDownload = () => {
    if (!document) return;

    const blob = new Blob([document.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement("a");
    a.href = url;
    a.download = `${document.title}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <SkeletonList />;

  if (!document) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-purple-900 flex items-center justify-center">
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-8">
          <p className="text-white text-center mb-4">Document not found</p>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="border-b border-white/10 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Separator orientation="vertical" className="h-6 bg-white/20" />
              <div>
                <h1 className="text-xl font-semibold text-white">
                  {isEditing ? editForm.title : document.title}
                </h1>
                <p className="text-sm text-white/60">
                  {isEditing ? editForm.documentType : document.docType}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Button
                    onClick={handleCancelEdit}
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    disabled={isSaving}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="bg-green-600 hover:bg-green-700 text-white"
                    disabled={isSaving}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    onClick={() => setShowDeleteDialog(true)}
                    variant="outline"
                    className="bg-red-500/10 border-red-500/20 text-red-300 hover:bg-red-500/20"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                  <Button
                    onClick={handleEdit}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-sm font-medium">
                  Document Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-white/50 mb-1">Type</p>
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                    {document.docType}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-white/50 mb-1">Version</p>
                  <p className="text-sm text-white">v{document.version}</p>
                </div>
                <div>
                  <p className="text-xs text-white/50 mb-1">Created</p>
                  <p className="text-sm text-white">
                    {formatDate(document.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-white/50 mb-1">Last Modified</p>
                  <p className="text-sm text-white">
                    {formatDate(document.updatedAt)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={() => router.push("/history")}
              variant="outline"
              className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <History className="h-4 w-4 mr-2" />
              View All History
            </Button>
          </div>

          {/* Document Content */}
          <div className="lg:col-span-3">
            {isEditing ? (
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-white mb-2">
                      Title
                    </Label>
                    <Input
                      id="title"
                      value={editForm.title}
                      onChange={(e) =>
                        setEditForm({ ...editForm, title: e.target.value })
                      }
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                      placeholder="Document title"
                    />
                  </div>

                  <div>
                    <Label htmlFor="documentType" className="text-white mb-2">
                      Document Type
                    </Label>
                    <Input
                      id="documentType"
                      value={editForm.documentType}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          documentType: e.target.value,
                        })
                      }
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                      placeholder="e.g., Report, Article, Notes"
                    />
                  </div>

                  <div>
                    <Label htmlFor="content" className="text-white mb-2">
                      Content
                    </Label>
                    <Textarea
                      id="content"
                      value={editForm.content}
                      onChange={(e) =>
                        setEditForm({ ...editForm, content: e.target.value })
                      }
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40 min-h-[500px] font-mono"
                      placeholder="Document content..."
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="changeDescription"
                      className="text-white mb-2"
                    >
                      Change Description (Optional)
                    </Label>
                    <Input
                      id="changeDescription"
                      value={editForm.changeDescription}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          changeDescription: e.target.value,
                        })
                      }
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                      placeholder="What did you change?"
                    />
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white backdrop-blur-lg border-white/20 shadow-2xl">
                <CardContent className="p-0">
                  {/* Document Paper Effect */}
                  <div className="bg-white min-h-[800px]">
                    {/* Document Header */}
                    <div className="border-b border-gray-200 px-12 py-8">
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {document.title}
                      </h1>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          {document.docType}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatDate(document.updatedAt || document.createdAt)}
                        </span>
                        <span>•</span>
                        <span>Version {document.version}</span>
                      </div>
                    </div>

                    {/* Document Body */}
                    <div className="px-12 py-8">
                      <div className="prose prose-lg max-w-none">
                        <div className="whitespace-pre-wrap text-gray-800 leading-relaxed font-serif">
                          {document.content}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-slate-900 border-white/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Delete Document
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              Are you sure you want to delete "{document.title}"? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              disabled={isDeleting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
