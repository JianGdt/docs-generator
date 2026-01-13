"use client";

import UserMenu from "@/app/(auth)/User";
import { FileText, Github, Settings } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-blue-500/20 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                AI Docs Generator
              </h1>
              <p className="text-sm text-blue-300">
                Powered by Groq (Free Tier)
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              href="https://github.com/yourusername/ai-docs-generator"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
            >
              <Github className="w-4 h-4" />
              <span className="text-sm hidden sm:inline">GitHub</span>
            </Link>
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
