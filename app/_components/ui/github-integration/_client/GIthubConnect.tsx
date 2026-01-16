"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Github,
  GitBranch,
  FileText,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CommitFormValues, commitSchema } from "@/app/lib/schema/github";
import { Repository } from "@/app/lib/types";

export default function GitHubIntegration({
  documentContent,
  documentType,
}: {
  documentContent: string;
  documentType: string;
}) {
  const { data: session, status } = useSession();
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingRepos, setFetchingRepos] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    if (session?.provider === "github" && session?.accessToken) {
      fetchRepositories();
    }
  }, [session?.provider, session?.accessToken]);

  useEffect(() => {
    form.setValue("path", getDefaultPath(documentType));
    form.setValue("message", `docs: Update ${documentType}`);
  }, [documentType, form]);

  function getDefaultPath(docType: string): string {
    const pathMap: Record<string, string> = {
      readme: "README.md",
      api: "docs/API.md",
      contributing: "CONTRIBUTING.md",
      changelog: "CHANGELOG.md",
      license: "LICENSE.md",
    };
    return pathMap[docType.toLowerCase()] || `${docType.toUpperCase()}.md`;
  }

  const fetchRepositories = async () => {
    try {
      setFetchingRepos(true);
      setError(null);
      const { data } = await axios.get("/api/github/repositories");

      if (data.repositories && Array.isArray(data.repositories)) {
        setRepositories(data.repositories);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err: any) {
      console.error("Failed to fetch repositories:", err);
      setError(
        err.response?.data?.error ||
          "Failed to fetch repositories. Please try reconnecting your GitHub account."
      );
    } finally {
      setFetchingRepos(false);
    }
  };

  const onSubmit = async (values: CommitFormValues) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const selectedRepo = repositories.find(
        (r) => r.fullName === values.repository
      );

      if (!selectedRepo) {
        throw new Error("Repository not found");
      }

      if (values.createPR) {
        const branchName = `docs/${documentType}-${Date.now()}`;
        const { data } = await axios.post("/api/github/pull-request", {
          owner: selectedRepo.owner,
          repo: selectedRepo.name,
          path: values.path,
          content: documentContent,
          message: values.message,
          title: values.prTitle || values.message,
          body:
            values.prBody ||
            `Auto-generated documentation update for ${documentType}`,
          base: selectedRepo.defaultBranch,
          head: branchName,
        });

        setSuccess(
          `Pull request created successfully! PR #${data.pullRequest.number}`
        );
      } else {
        const { data } = await axios.post("/api/github/commit", {
          owner: selectedRepo.owner,
          repo: selectedRepo.name,
          path: values.path,
          content: documentContent,
          message: values.message,
          branch: selectedRepo.defaultBranch,
        });

        setSuccess(`Documentation committed #${data} successfully!`);
      }

      const currentRepo = values.repository;
      form.reset({
        repository: currentRepo,
        path: getDefaultPath(documentType),
        message: `docs: Update ${documentType}`,
        createPR: false,
        prTitle: "",
        prBody: "",
      });
    } catch (err: any) {
      console.error("Error pushing documentation:", err);
      setError(
        err.response?.data?.error ||
          err.message ||
          "Failed to push documentation. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = () => {
    window.location.href = "/api/auth/signin/github";
  };

  if (status === "loading") {
    return (
      <Card className="bg-slate-800/50 border-purple-500/20">
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
        </CardContent>
      </Card>
    );
  }
  if (!session) {
    return (
      <Card className="bg-slate-800/50 border-purple-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Github className="w-5 h-5" />
            GitHub Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-300 text-sm mb-4">
            Connect your GitHub account to commit documentation directly to your
            repositories.
          </p>
          <Button
            onClick={handleSignIn}
            className="w-full bg-slate-700 hover:bg-slate-600"
            variant="outline"
          >
            <Github className="w-4 h-4 mr-2" />
            Sign in with GitHub
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (session.provider !== "github") {
    return (
      <Card className="bg-slate-800/50 border-purple-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Github className="w-5 h-5" />
            GitHub Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="bg-blue-500/10 border-blue-500/50 mb-4">
            <AlertCircle className="h-4 w-4 text-blue-400" />
            <AlertDescription className="text-blue-400">
              You're signed in with {session.provider}. To use GitHub
              integration, please sign in with GitHub.
            </AlertDescription>
          </Alert>
          <Button
            onClick={handleSignIn}
            className="w-full bg-slate-700 hover:bg-slate-600"
            variant="outline"
          >
            <Github className="w-4 h-4 mr-2" />
            Sign in with GitHub
          </Button>
        </CardContent>
      </Card>
    );
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
        {fetchingRepos ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
            <span className="ml-2 text-slate-300">Loading repositories...</span>
          </div>
        ) : repositories.length === 0 && !error ? (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-300 mb-4">No repositories found</p>
            <Button onClick={fetchRepositories} variant="outline" size="sm">
              Retry
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="repository"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200">Repository</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={repositories.length === 0}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-slate-900 text-white border-slate-700">
                          <SelectValue placeholder="Select repository" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {repositories.map((repo) => (
                          <SelectItem
                            key={repo.id}
                            value={repo.fullName}
                            className="text-white hover:bg-slate-700"
                          >
                            {repo.fullName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="path"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200">File Path</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="docs/README.md"
                        className="bg-slate-900 text-white border-slate-700"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200">
                      Commit Message
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="docs: Update documentation"
                        className="bg-slate-900 text-white border-slate-700"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="createPR"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="w-4 h-4 rounded border-slate-600 bg-slate-900"
                      />
                    </FormControl>
                    <FormLabel className="!mt-0 text-slate-200 font-normal">
                      Create Pull Request instead of direct commit
                    </FormLabel>
                  </FormItem>
                )}
              />

              {createPR && (
                <>
                  <FormField
                    control={form.control}
                    name="prTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-200">
                          PR Title
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Update documentation"
                            className="bg-slate-900 text-white border-slate-700"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="prBody"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-200">
                          PR Description
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Describe the changes..."
                            className="bg-slate-900 text-white border-slate-700 min-h-[100px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-green-500/10 border-green-500/50">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <AlertDescription className="text-green-400">
                    {success}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={
                  loading || !documentContent || repositories.length === 0
                }
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {createPR ? "Creating PR..." : "Committing..."}
                  </>
                ) : (
                  <>
                    {createPR ? (
                      <GitBranch className="w-4 h-4 mr-2" />
                    ) : (
                      <FileText className="w-4 h-4 mr-2" />
                    )}
                    {createPR ? "Create Pull Request" : "Commit to Repository"}
                  </>
                )}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
