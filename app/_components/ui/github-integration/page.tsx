"use client";

import { useDocsStore } from "@/app/lib/store";
import GitHubIntegration from "./_client/GIthubConnect";

export default function GithubConnect() {
  const { generatedDocs, docType } = useDocsStore();

  if (!generatedDocs || generatedDocs.trim() === "") {
    return null;
  }

  return (
    <GitHubIntegration documentContent={generatedDocs} documentType={docType} />
  );
}
