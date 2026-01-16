"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Header from "../../../layout/Header";
import InputSection from "../../../InputSection";
import PreviewSection from "../../../PreviewSection";
import GitHubIntegration from "../../github-integration/_client/GIthubConnect";
import { useDocsStore } from "@/app/lib/store";
import { DocsGeneratorProps } from "@/app/lib/types";

export default function DocsGenerator({ user }: DocsGeneratorProps) {
  const { data: session, status } = useSession();
  const { generatedDocs, docType } = useDocsStore();
  const router = useRouter();
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-purple-900 flex items-center justify-center">
        <div className="text-white flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-lg">Loading...</span>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated" || !session?.user) {
    return null;
  }

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
            />
          )}
        </div>
      </div>
    </div>
  );
}
