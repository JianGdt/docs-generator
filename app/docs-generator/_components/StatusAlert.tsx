"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";

interface StatusAlertProps {
  type: "error" | "success";
  message: string;
}

export function StatusAlert({ type, message }: StatusAlertProps) {
  if (type === "error") {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="bg-green-500/10 border-green-500/50">
      <CheckCircle className="h-4 w-4 text-green-400" />
      <AlertDescription className="text-green-400">{message}</AlertDescription>
    </Alert>
  );
}
