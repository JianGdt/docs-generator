"use client";

import { StatItem } from "../lib/@types/preview";
import { Card } from "./ui/card";

interface StatCardProps {
  stat: StatItem;
}

export default function StatCard({ stat }: StatCardProps) {
  return (
    <Card className="hover:scale-105 transition-all duration-200 ease-in-out p-4 flex flex-col items-center">
      <div
        className={`inline-flex items-center justify-center w-10 h-10 ${stat.bgColor} rounded-lg mb-2`}
      >
        <stat.icon className={`w-5 h-5 ${stat.color}`} />
      </div>
      <div className="text-2xl font-bold text-black dark:text-white mb-1">
        {stat.value}
      </div>
      <div className="text-xs text-black dark:text-white">{stat.label}</div>
    </Card>
  );
}
