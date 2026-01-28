"use client";

import { File, X } from "lucide-react";
import { useDocsStore } from "@//lib/store/useDocStore";
import { formatFileSize } from "@/app/lib/utils";
import { Button } from "@/components/ui/button";
import { UploadedFileData } from "@//lib/@types/store";

interface UploadedFilesListProps {
  files: UploadedFileData[];
}

export function UploadedFilesList({ files }: UploadedFilesListProps) {
  const { setUploadedFiles, uploadedFiles } = useDocsStore();

  const removeFile = (indexToRemove: number) => {
    setUploadedFiles(
      uploadedFiles.filter((_, index) => index !== indexToRemove),
    );
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-slate-300">
        Uploaded Files ({files.length})
      </p>
      {files.map((file, index) => (
        <div
          key={index}
          className="flex items-center justify-between bg-slate-900/50 p-3 rounded-lg group"
        >
          <div className="flex items-center space-x-3">
            <File className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-white text-sm font-medium">{file.fileName}</p>
              <p className="text-slate-500 text-xs">
                {formatFileSize(file.fileSize)}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              removeFile(index);
            }}
            className="text-slate-400 hover:text-red-400 hover:bg-transparent opacity-0 group-hover:opacity-100 transition-all"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      ))}
    </div>
  );
}
