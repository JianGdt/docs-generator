"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Github, CheckCircle } from "lucide-react";
import { CommitFormValues, commitSchema } from "@/app/lib/schema/github";
import { getDefaultPath } from "@/app/lib/utils";
import { EmptyState } from "../_components/EmptyState";
import { RepositorySelect } from "../_components/RepositorySelect";
import { CommitFields } from "../_components/CommitFields";
import { PullRequestToggle } from "../_components/PullRequestToggle";
import { PullRequestFields } from "../_components/PullRequestFields";
import { StatusAlert } from "../_components/StatusAlert";
import { SubmitButton } from "../_components/SubmitButton";
import { GitHubSignInCard } from "../_components/GitHubSignInCard";
import type { Session } from "next-auth";
import { useGitHubRepositories } from "@//hooks/github/useGitHubRepo";
import { useGitHubCommit } from "@//hooks/github/useGitHubCommit";

interface GitHubIntegrationProps {
  documentContent: string;
  documentType: string;
  session: Session;
}

export default function GitHubIntegration({
  documentContent,
  documentType,
  session,
}: GitHubIntegrationProps) {
  const {
    repositories,
    loading: fetchingRepos,
    error: repoError,
    refetch,
  } = useGitHubRepositories(session?.accessToken);

  const { commit, loading, success, error } = useGitHubCommit();

  const form = useForm<CommitFormValues>({
    resolver: zodResolver(commitSchema),
    defaultValues: {
      repository: "",
      path: getDefaultPath(documentType),
      message: `docs: Update ${documentType}`,
      createPR: false,
      prTitle: "",
      prBody: "",
    },
  });

  const createPR = form.watch("createPR");

  useEffect(() => {
    form.setValue("path", getDefaultPath(documentType));
    form.setValue("message", `docs: Update ${documentType}`);
  }, [documentType, form]);

  const onSubmit = async (values: CommitFormValues) => {
    await commit(values, documentContent, repositories);

    form.reset({
      repository: values.repository,
      path: getDefaultPath(documentType),
      message: `docs: Update ${documentType}`,
      createPR: false,
      prTitle: "",
      prBody: "",
    });
  };

  if (!session || session.provider !== "github") {
    return <GitHubSignInCard currentProvider={session?.provider} />;
  }

  return (
    <Card className="bg-slate-800/50 border-purple-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Github className="w-5 h-5" />
          GitHub Integration
          <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {fetchingRepos || (repositories.length === 0 && !repoError) ? (
          <EmptyState loading={fetchingRepos} onRetry={refetch} />
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <RepositorySelect
                control={form.control}
                repositories={repositories}
              />
              <CommitFields control={form.control} />
              <PullRequestToggle control={form.control} />

              {createPR && <PullRequestFields control={form.control} />}

              {error && <StatusAlert type="error" message={error} />}
              {success && <StatusAlert type="success" message={success} />}

              <SubmitButton
                loading={loading}
                createPR={createPR}
                disabled={
                  loading || !documentContent || repositories.length === 0
                }
              />
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
