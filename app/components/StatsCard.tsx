"use client";

import { StatItem } from "../lib/@types/preview";

interface StatCardProps {
  stat: StatItem;
}

export default function StatCard({ stat }: StatCardProps) {
  return (
    <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg p-4 border border-blue-500/10 text-center hover:border-blue-500/30 transition-all hover:scale-105">
      <div
        className={`inline-flex items-center justify-center w-10 h-10 ${stat.bgColor} rounded-lg mb-2`}
      >
        <stat.icon className={`w-5 h-5 ${stat.color}`} />
      </div>
      <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
      <div className="text-xs text-slate-400">{stat.label}</div>
    </div>
  );
}
