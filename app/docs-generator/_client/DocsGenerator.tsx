"use client";

import Header from "@/components/layout/Header";
import InputSection from "@/components/InputSection";
import PreviewSection from "@/components/PreviewSection";
import { useDocsStore } from "@//lib/store/useDocStore";
import GitHubIntegration from "./GithubConnection";
import { DocsGeneratorProps } from "@//lib/types";

export default function DocsGenerator({ user, session }: DocsGeneratorProps) {
  const { generatedDocs, docType } = useDocsStore();

  return (
    <main>
      <Header user={user} />
      <div className="w-full md:max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
    </main>
  );
}
