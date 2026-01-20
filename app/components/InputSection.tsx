"use client";

import axios from "axios";
import {
  Github,
  Code2,
  Upload,
  Sparkles,
  Loader2,
  X,
  File,
} from "lucide-react";
import { useState } from "react";

import { useDocsStore } from "@/app/lib/store";
import { DocType, InputMethod } from "@/app/lib/types";
import { DOC_TYPES, INPUT_METHODS } from "@/app/lib/constants";

export default function InputSection() {
  const {
    inputMethod,
    docType,
    githubUrl,
    codeInput,
    isGenerating,
    error,
    uploadedFiles,
    setInputMethod,
    setDocType,
    setGithubUrl,
    setCodeInput,
    setGeneratedDocs,
    setIsGenerating,
    setError,
    setUploadedFiles,
  } = useDocsStore();

  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append("files", file);
      });

      const response = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setUploadedFiles(response.data.files);
      } else {
        throw new Error(response.data.error || "Upload failed");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error || err.message || "Upload failed";
      setError(errorMessage);
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

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

  const removeFile = (indexToRemove: number) => {
    setUploadedFiles(
      uploadedFiles.filter((_, index) => index !== indexToRemove),
    );
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      let data = "";

      if (inputMethod === "github") {
        data = githubUrl;
      } else if (inputMethod === "code") {
        data = codeInput;
      } else if (inputMethod === "upload") {
        // Combine all uploaded files content
        data = uploadedFiles
          .map((file) => `// File: ${file.fileName}\n${file.content}`)
          .join("\n\n");
      }

      if (!data.trim()) {
        throw new Error("Please provide input data");
      }

      const response = await axios.post("/api/generate", {
        method: inputMethod,
        data,
        docType,
      });

      if (response.data.success) {
        await fetch("/api/docs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: `My Doc - ${docType}`,
            content: data,
            docType: docType,
            repositoryUrl: githubUrl,
          }),
        });
      }

      if (response.data.success) {
        setGeneratedDocs(response.data.documentation);
      } else {
        throw new Error(response.data.error || "Generation failed");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error || err.message || "An error occurred";
      setError(errorMessage);
      console.error("Error generating docs:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const inputMethods = [
    { id: "github" as InputMethod, label: INPUT_METHODS.github, icon: Github },
    { id: "code" as InputMethod, label: INPUT_METHODS.code, icon: Code2 },
    { id: "upload" as InputMethod, label: INPUT_METHODS.upload, icon: Upload },
  ];

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-blue-500/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Input Source</h2>
        <select
          value={docType}
          onChange={(e) => setDocType(e.target.value as DocType)}
          disabled={isGenerating}
          className="bg-slate-700 text-white text-sm rounded-lg px-3 py-2 border border-slate-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {Object.entries(DOC_TYPES).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex space-x-2 mb-6 bg-slate-900/50 p-1 rounded-lg">
        {inputMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => setInputMethod(method.id)}
            disabled={isGenerating}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md font-medium transition-all ${
              inputMethod === method.id
                ? "bg-blue-500 text-white shadow-lg shadow-blue-500/50"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <method.icon className="w-4 h-4" />
            <span className="text-sm">{method.label}</span>
          </button>
        ))}
      </div>

      {inputMethod === "github" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              GitHub Repository URL
            </label>
            <input
              type="text"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/username/repository"
              disabled={isGenerating}
              className="w-full bg-slate-900 text-white rounded-lg px-4 py-3 border border-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <div className="flex items-start space-x-2 text-sm text-slate-400 bg-slate-900/50 p-3 rounded-lg">
            <Sparkles className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <p>
              AI will analyze your repository structure, code, and generate
              comprehensive documentation
            </p>
          </div>
        </div>
      )}

      {inputMethod === "code" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Paste Your Code
            </label>
            <textarea
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              disabled={isGenerating}
              className="w-full h-64 bg-slate-900 text-white rounded-lg px-4 py-3 font-mono text-sm border border-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="// Paste your code here..."
            />
          </div>
          <div className="flex items-start space-x-2 text-sm text-slate-400 bg-slate-900/50 p-3 rounded-lg">
            <Sparkles className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <p>
              Paste your source code and AI will generate professional
              documentation based on your code structure and functionality
            </p>
          </div>
        </div>
      )}

      {inputMethod === "upload" && (
        <div className="space-y-4">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer group ${
              isDragging
                ? "border-blue-500 bg-blue-500/10"
                : "border-slate-700 hover:border-blue-500"
            }`}
            onClick={() => document.getElementById("file-input")?.click()}
          >
            <input
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
              {isUploading
                ? "Uploading..."
                : "Drop files here or click to upload"}
            </p>
            <p className="text-sm text-slate-400">
              Support: .js, .ts, .jsx, .tsx, .json, .md
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Max 5MB per file, up to 10 files
            </p>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-300">
                Uploaded Files ({uploadedFiles.length})
              </p>
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-slate-900/50 p-3 rounded-lg group"
                >
                  <div className="flex items-center space-x-3">
                    <File className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-white text-sm font-medium">
                        {file.fileName}
                      </p>
                      <p className="text-slate-500 text-xs">
                        {formatFileSize(file.fileSize)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="text-slate-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-start space-x-2">
            <svg
              className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        </div>
      )}

      <button
        onClick={handleGenerate}
        disabled={
          isGenerating ||
          (inputMethod === "github" && !githubUrl.trim()) ||
          (inputMethod === "code" && !codeInput.trim()) ||
          (inputMethod === "upload" && uploadedFiles.length === 0)
        }
        className="w-full mt-6 flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 hover:scale-[1.02] active:scale-[0.98]"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Generating with Groq AI...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            <span>Generate Documentation</span>
          </>
        )}
      </button>
    </div>
  );
}
