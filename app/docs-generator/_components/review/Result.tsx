"use client";

import { DocReview } from "@//lib/@types/review";
import {
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  AlertCircle,
  Lightbulb,
  CheckCircle,
} from "lucide-react";
import { ReviewCard } from "../ReviewCard";
import SummaryCard from "../SummaryCard";

type ReviewResultProps = {
  review: DocReview;
};

export function ReviewResult({ review }: ReviewResultProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <SummaryCard
          value={review?.missingSections?.length || 0}
          label="Missing Sections"
          variant="danger"
          icon={AlertCircle}
        />

        <SummaryCard
          value={review?.outdatedWarnings?.length || 0}
          label="Warnings"
          variant="warning"
          icon={AlertTriangle}
        />

        <SummaryCard
          value={review?.improvements?.length || 0}
          label="Improvements"
          variant="info"
          icon={Lightbulb}
        />

        <SummaryCard
          value={review?.positives?.length || 0}
          label="Strengths"
          variant="success"
          icon={CheckCircle}
        />
      </div>

      <ReviewCard
        title="Missing Sections"
        description="These essential sections should be added to complete your documentation"
        items={review?.missingSections || []}
        icon={XCircle}
        iconColor="text-red-600 dark:text-red-400"
        bgColor="bg-red-50/50 dark:bg-red-950/20"
        borderColor="border-red-200/50 dark:border-red-900/50"
        hoverColor="hover:bg-red-50 dark:hover:bg-red-950/30"
        badgeVariant="destructive"
        dotColor="bg-red-500"
        checkIconColor="text-red-400"
      />

      <ReviewCard
        title="Outdated Warnings"
        description="These items may need updating to reflect current information"
        items={review?.outdatedWarnings || []}
        icon={AlertTriangle}
        iconColor="text-amber-600 dark:text-amber-400"
        bgColor="bg-amber-50/50 dark:bg-amber-950/20"
        borderColor="border-amber-200/50 dark:border-amber-900/50"
        hoverColor="hover:bg-amber-50 dark:hover:bg-amber-950/30"
        badgeClassName="border-amber-500 text-amber-700 dark:text-amber-400"
        dotColor="bg-amber-500"
        checkIconColor="text-amber-400"
      />
      <ReviewCard
        title="Suggested Improvements"
        description="Actionable recommendations to enhance your documentation quality"
        items={review?.improvements || []}
        icon={TrendingUp}
        iconColor="text-blue-600 dark:text-blue-400"
        bgColor="bg-blue-50/50 dark:bg-blue-950/20"
        borderColor="border-blue-200/50 dark:border-blue-900/50"
        hoverColor="hover:bg-blue-50 dark:hover:bg-blue-950/30"
        badgeClassName="border-blue-500 text-blue-700 dark:text-blue-400"
        dotColor="bg-blue-500"
        checkIconColor="text-blue-400"
      />

      <ReviewCard
        title="Documentation Strengths"
        description="These aspects of your documentation are well-executed"
        items={review?.positives || []}
        icon={ShieldCheck}
        iconColor="text-green-600 dark:text-green-400"
        bgColor="bg-green-50/50 dark:bg-green-950/20"
        borderColor="border-green-200/50 dark:border-green-900/50"
        hoverColor=""
        badgeClassName="border-green-500 text-green-700 dark:text-green-400"
        dotColor="bg-green-500"
        checkIconColor="text-green-600 dark:text-green-400"
        showHoverCheck={false}
      />
    </div>
  );
}
