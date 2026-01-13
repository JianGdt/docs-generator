"use client";

import { FileText } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import LoginForm from "../Login";

function LoginContent() {
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-lg">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">AI Docs Generator</h1>
          </div>
          <p className="text-slate-400">
            Generate professional documentation with AI
          </p>
        </div>

        {/* Success Message */}
        {registered && (
          <div className="mb-6 bg-green-500/10 border border-green-500/50 rounded-lg p-4">
            <p className="text-green-400 text-sm text-center">
              Account created successfully! Please sign in.
            </p>
          </div>
        )}

        <LoginForm />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
