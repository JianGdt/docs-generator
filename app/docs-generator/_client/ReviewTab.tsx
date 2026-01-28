"use client";
import { useDocReviewStore } from "@//lib/store/useDocReviewStore";
import { useDocsStore } from "@//lib/store/useDocStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Sparkles,
  FileText,
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { ReviewResult } from "../_components/review/Result";
import { formatDate } from "@//lib/utils";
import { Badge } from "@//components/ui/badge";

export default function ReviewTab() {
  const { generatedDocs } = useDocsStore();
  const { review, reviewDocs, loading, error, progress } = useDocReviewStore();

  // No docs generated state
  if (!generatedDocs) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center mb-6 shadow-lg">
          <FileText className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-2xl font-bold mb-3">No Documentation Found</h3>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          You need to generate documentation first before running a review. Head
          over to the Generate tab to get started.
        </p>
        <Button variant="outline" size="lg">
          Go to Generate Tab
        </Button>
      </div>
    );
  }

  const handleRunReview = () => {
    reviewDocs(generatedDocs);
  };

  // Loading state with dynamic progress
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Card className="border-2 border-dashed">
          <div className="flex flex-col items-center justify-center p-16 text-center">
            <div className="relative mb-8">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
            </div>

            <h3 className="text-2xl font-bold mb-3">
              Analyzing Your Documentation
            </h3>
            <p className="text-muted-foreground mb-8 max-w-md">
              Our AI is carefully reviewing your documentation for completeness,
              accuracy, and best practices.
            </p>

            <div className="w-full max-w-md space-y-3">
              <Progress value={progress.value} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span className="font-medium">{progress.message}</span>
                <span className="font-mono">{progress.value}%</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription className="ml-2 text-base">
            <strong>Review Failed:</strong> {error}
          </AlertDescription>
        </Alert>
        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={handleRunReview}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Empty state - Ready to review
  if (!review) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Card>
          <div className="flex flex-col items-center justify-center p-16 text-center">
            <div className="relative mb-8">
              <Sparkles className="w-12 h-12 text-primary-foreground" />
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-green-500 border-4 border-background" />
            </div>

            <h2 className="text-3xl font-bold mb-4">
              Ready to Review Your Documentation
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl text-lg">
              Our AI will thoroughly analyze your documentation, checking for
              completeness, accuracy, and adherence to best practices.
            </p>

            <Button
              size="lg"
              onClick={handleRunReview}
              className="gap-2 text-base px-8 h-12 shadow-lg"
            >
              <Sparkles className="w-5 h-5" />
              Start AI Review
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-600 to-green-700";
    if (score >= 60) return "bg-yellow-500 to-yellow-600";
    return "bg-red-500 to-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Great";
    if (score >= 70) return "Good";
    if (score >= 60) return "Fair";
    return "Needs Improvement";
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-md md:text-lg font-bold mb-2">
            Documentation Review
          </h2>
          <p className="text-muted-foreground text-sm md:text-lg">
            AI-powered analysis and recommendations
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleRunReview}
          disabled={loading}
          className="gap-2 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          Re-run Review
        </Button>
      </div>

      <Card className="mb-8 overflow-hidden relative border-2">
        <div className="relative p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-end gap-4 mb-4">
                <div
                  className={`text-7xl md:text-8xl font-bold ${getScoreColor(review.score)}`}
                >
                  {review.score}
                </div>
                <div className="text-4xl font-light text-muted-foreground mb-2">
                  /100
                </div>
              </div>

              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                {review.summary}
              </p>
            </div>

            <div className="flex flex-col items-end gap-3">
              <Badge
                className={`${getScoreBgColor(review.score)} text-black px-2 py-1.5 dark:text-white `}
              >
                {getScoreLabel(review.score)}
              </Badge>
              {review.createdAt && (
                <p className="text-sm text-muted-foreground">
                  Reviewed on {formatDate(review.createdAt)}
                </p>
              )}
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">Overall Documentation Quality</span>
              <Badge>{review.score}%</Badge>
            </div>
            <Progress value={review.score} className="h-3 bg-muted" />
          </div>
        </div>
      </Card>

      <Separator className="my-10" />

      <ReviewResult review={review} />
    </div>
  );
}
