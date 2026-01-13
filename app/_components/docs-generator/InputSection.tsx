"use client";

import axios from "axios";
import {
  Github,
  Code2,
  Upload,
  Sparkles,
  Loader2,
  BookOpen,
} from "lucide-react";
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
    setInputMethod,
    setDocType,
    setGithubUrl,
    setCodeInput,
    setGeneratedDocs,
    setIsGenerating,
    setError,
  } = useDocsStore();

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const data = inputMethod === "github" ? githubUrl : codeInput;

      if (!data.trim()) {
        throw new Error("Please provide input data");
      }

      const response = await axios.post("/api/generate", {
        method: inputMethod,
        data,
        docType,
      });

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

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-blue-500/20 p-6">
        {/* Header with Doc Type Selector */}
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

        {/* Input Method Tabs */}
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

        {/* GitHub Input */}
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
                comprehensive documentation using Groq (free tier - 14,400
                requests/day)
              </p>
            </div>
          </div>
        )}

        {/* Code Input */}
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

        {/* Upload Input */}
        {inputMethod === "upload" && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-lg p-8 text-center transition-colors cursor-pointer group">
              <Upload className="w-12 h-12 text-slate-500 group-hover:text-blue-400 mx-auto mb-4 transition-colors" />
              <p className="text-white font-medium mb-1">
                Drop files here or click to upload
              </p>
              <p className="text-sm text-slate-400">
                Support: .js, .ts, .jsx, .tsx, .py, .java, .go, .rs
              </p>
              <p className="text-xs text-slate-500 mt-2">Coming soon...</p>
            </div>
          </div>
        )}

        {/* Error Message */}
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

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={
            isGenerating ||
            (!githubUrl.trim() && !codeInput.trim()) ||
            inputMethod === "upload"
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

      {/* Features Info Card */}
      <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-blue-500/10">
        <h3 className="text-white font-semibold mb-4 flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-blue-400" />
          <span>What Gets Generated</span>
        </h3>
        <ul className="space-y-2 text-sm text-slate-300">
          {[
            "Project overview and description",
            "Installation instructions with code blocks",
            "Usage examples with syntax highlighting",
            "API documentation (if applicable)",
            "Configuration options and environment variables",
            "Contributing guidelines and code of conduct",
            "License information and attribution",
          ].map((item, idx) => (
            <li key={idx} className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0"></div>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Stats Info */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-4 border border-blue-500/20">
        <div className="flex items-center space-x-2 text-sm text-slate-300">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>
            <strong className="text-white">Free Tier:</strong> 14,400
            requests/day with Groq AI
          </span>
        </div>
      </div>
    </div>
  );
}
