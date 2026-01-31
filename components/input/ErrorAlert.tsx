"use client";

import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";

interface ErrorAlertProps {
  message: string;
}

export function ErrorAlert({ message }: ErrorAlertProps) {
  return (
    <Alert
      variant="destructive"
      className="mt-4 bg-red-500/10 border-red-500/50 animate-in fade-in slide-in-from-top-2 duration-300"
    >
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="text-red-400">{message}</AlertDescription>
    </Alert>
  );
}
