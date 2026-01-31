"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Form } from "../../../components/ui/form";
import { Github, CheckCircle, AlertCircle } from "lucide-react";
import { CommitFormValues, commitSchema } from "@/lib/schema/github";
import { getDefaultPath } from "@/lib/utils";
import { RepositorySelect } from "../_components/RepositorySelect";
import { CommitFields } from "../_components/CommitFields";
import { PullRequestToggle } from "../_components/PullRequestToggle";
import { PullRequestFields } from "../_components/PullRequestFields";
import { StatusAlert } from "../_components/StatusAlert";
import { SubmitButton } from "../_components/SubmitButton";
import { useGitHubRepositories } from "@//hooks/github/useGitHubRepo";
import { useGitHubCommit } from "@//hooks/github/useGitHubCommit";
import { GitHubIntegrationProps } from "@//lib/@types/github";
import EmptyState from "../../../components/EmptyState";
import { Alert, AlertDescription } from "../../../components/ui/alert";

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
    isGitHubUser,
  } = useGitHubRepositories();

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

  // Show login prompt only if not logged in at all
  if (!session) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Github className="w-5 h-5" />
            GitHub Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please sign in to use GitHub integration features.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-black dark:text-white">
          <Github className="w-5 h-5" />
          GitHub Integration
          {isGitHubUser && (
            <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Show repository selector only for GitHub users */}
        {isGitHubUser ? (
          <>
            {fetchingRepos || (repositories.length === 0 && !repoError) ? (
              <EmptyState
                type="docsgen"
                loading={fetchingRepos}
                onRetry={refetch}
              />
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
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
          </>
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You're signed in with {session.provider}. To commit documentation
              to GitHub repositories, please sign in with GitHub. You can still
              generate documentation from GitHub URLs using the input methods
              above.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
