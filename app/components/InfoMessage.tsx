"use client";

import { LucideIcon } from "lucide-react";

interface InfoMessageProps {
  icon: LucideIcon;
  message: string;
}

export function InfoMessage({ icon: Icon, message }: InfoMessageProps) {
  return (
    <div className="flex items-start space-x-2 text-sm text-slate-400 bg-slate-900/50 p-3 rounded-lg">
      <Icon className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
      <p>{message}</p>
    </div>
  );
}
