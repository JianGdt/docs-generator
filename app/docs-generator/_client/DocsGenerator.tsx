"use client";

import Header from "@/components/layout/Header";
import InputSection from "@/components/InputSection";
import PreviewSection from "@/components/PreviewSection";
import GitHubIntegration from "./GithubConnection";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DocsGeneratorProps } from "@//lib/@types/components";
import { useDocsStore } from "@//lib/store/useDocStore";
import ReviewTab from "./ReviewTab";

export default function DocsGenerator({ user, session }: DocsGeneratorProps) {
  const { generatedDocs, docType } = useDocsStore();

  return (
    <main>
      <Header user={user} />

      <div className="w-full md:max-w-7xl mx-auto px-6 lg:px-8 py-6">
        <Tabs defaultValue="generate" className="w-full">
          <div className="flex justify-center mb-6">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="generate">Generate</TabsTrigger>
              <TabsTrigger value="review">Review</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="generate">
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
          </TabsContent>

          <TabsContent value="review">
            <ReviewTab />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
