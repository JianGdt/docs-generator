"use client";

import { useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { useDocsStore } from "@/app/lib/store";
import { cn } from "../../lib/utils";
import { useFileUpload } from "../../hooks/useFIleUpload";
import { UploadedFilesList } from "./FIlesLIsts";
import { Input } from "../ui/input";

export function FileUpload() {
  const { uploadedFiles, isGenerating } = useDocsStore();
  const { isUploading, handleFileUpload } = useFileUpload();
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById("file-input")?.click()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer group",
          isDragging
            ? "border-blue-500 bg-blue-500/10"
            : "border-slate-700 hover:border-blue-500",
        )}
      >
        <Input
          id="file-input"
          type="file"
          multiple
          accept=".js,.jsx,.ts,.tsx,.json,.md"
          onChange={(e) => handleFileUpload(e.target.files)}
          className="hidden"
          disabled={isUploading || isGenerating}
        />
        {isUploading ? (
          <Loader2 className="w-12 h-12 text-blue-400 mx-auto mb-4 animate-spin" />
        ) : (
          <Upload className="w-12 h-12 text-slate-500 group-hover:text-blue-400 mx-auto mb-4 transition-colors" />
        )}
        <p className="text-white font-medium mb-1">
          {isUploading ? "Uploading..." : "Drop files here or click to upload"}
        </p>
        <p className="text-sm text-slate-400">
          Support: .js, .ts, .jsx, .tsx, .json, .md
        </p>
        <p className="text-xs text-slate-500 mt-2">
          Max 5MB per file, up to 10 files
        </p>
      </div>

      {uploadedFiles.length > 0 && <UploadedFilesList files={uploadedFiles} />}
    </div>
  );
}
