"use client";

import { Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function TipsAlert() {
  return (
    <Alert className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
      <Info className="h-4 w-4 text-blue-400" />
      <AlertDescription className="text-slate-400">
        <div className="font-semibold text-white text-sm mb-2">Tips</div>
        <ul className="space-y-1 text-xs">
          <li>
            • Copy the markdown and paste it directly into your repository
          </li>
          <li>• Download as .md file and add it to your project root</li>
          <li>• Customize the generated content to match your needs</li>
        </ul>
      </AlertDescription>
    </Alert>
  );
}
