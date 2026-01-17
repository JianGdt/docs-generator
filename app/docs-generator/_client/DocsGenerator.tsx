"use client";

import { Loader2 } from "lucide-react";
import Header from "@/components/layout/Header";
import InputSection from "@/components/InputSection";
import PreviewSection from "@/components/PreviewSection";
import { useDocsStore } from "@/app/lib/store";
import GitHubIntegration from "./GithubConnection";
import { DocsGeneratorProps } from "@//lib/types";

export default function DocsGenerator({ user, session }: DocsGeneratorProps) {
  const { generatedDocs, docType } = useDocsStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-purple-900">
      <Header user={user} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <InputSection />
          <PreviewSection />

          {generatedDocs && (
            <GitHubIntegration
              documentContent={generatedDocs}
              documentType={docType}
              session={session}
            />
          )}
        </div>
      </div>
    </div>
  );
}
