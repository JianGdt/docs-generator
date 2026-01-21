"use client";

import { FileText, Clock, Hash } from "lucide-react";
import { calculateReadingTime } from "../lib/utils";
import { StatsDisplayProps } from "../lib/types";
import StatCard from "./StatsCard";

export default function StatsDisplay({ docs }: StatsDisplayProps) {
  const wordCount = docs.trim().split(/\s+/).length;
  const lineCount = docs.split("\n").length;
  const readingTime = calculateReadingTime(docs);

  const stats = [
    {
      label: "Words",
      value: wordCount.toLocaleString(),
      icon: FileText,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Lines",
      value: lineCount.toLocaleString(),
      icon: Hash,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      label: "Read Time",
      value: `${readingTime} min`,
      icon: Clock,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {stats.map((stat, idx) => (
        <StatCard key={idx} stat={stat} />
      ))}
    </div>
  );
}
