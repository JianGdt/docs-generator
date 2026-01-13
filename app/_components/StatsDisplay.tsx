'use client';

import React from 'react';
import { FileText, Clock, Hash } from 'lucide-react';
import { calculateReadingTime } from '@/app/lib/utils';

interface StatsDisplayProps {
  docs: string;
}

export default function StatsDisplay({ docs }: StatsDisplayProps) {
  const wordCount = docs.trim().split(/\s+/).length;
  const lineCount = docs.split('\n').length;
  const charCount = docs.length;
  const readingTime = calculateReadingTime(docs);

  const stats = [
    {
      label: 'Words',
      value: wordCount.toLocaleString(),
      icon: FileText,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Lines',
      value: lineCount.toLocaleString(),
      icon: Hash,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
    {
      label: 'Read Time',
      value: `${readingTime} min`,
      icon: Clock,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="bg-slate-800/30 backdrop-blur-sm rounded-lg p-4 border border-blue-500/10 text-center hover:border-blue-500/30 transition-all hover:scale-105"
        >
          <div className={`inline-flex items-center justify-center w-10 h-10 ${stat.bgColor} rounded-lg mb-2`}>
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
          </div>
          <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
          <div className="text-xs text-slate-400">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}