"use client";
import StatCard from "@//components/StatsCard";
import { StatItem } from "@//lib/@types/preview";
import { formatDate } from "@//lib/utils";
import { Clock, FileText } from "lucide-react";

interface StatsGridProps {
  totalDocuments: number | any;
  lastUpdated?: string;
}

export function StatsGrid({ totalDocuments, lastUpdated }: StatsGridProps) {
  const stats: StatItem[] = [
    {
      icon: FileText,
      label: "Total Documents",
      value: totalDocuments,
      color: "text-blue-300",
      bgColor: "bg-blue-500/20",
    },
    {
      icon: Clock,
      label: "Last Updated",
      value: lastUpdated ? formatDate(lastUpdated) : "N/A",
      color: "text-purple-300",
      bgColor: "bg-purple-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      {stats.map((stat, index) => (
        <StatCard key={index} stat={stat} />
      ))}
    </div>
  );
}
