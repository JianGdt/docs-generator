"use client";

import { Button } from "@/components/ui/button";
import { FileText, GitBranch, Loader2 } from "lucide-react";

interface SubmitButtonProps {
  loading: boolean;
  createPR: boolean;
  disabled: boolean;
}

export function SubmitButton({
  loading,
  createPR,
  disabled,
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      disabled={disabled}
      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          {createPR ? "Creating PR..." : "Committing..."}
        </>
      ) : (
        <>
          {createPR ? (
            <GitBranch className="w-4 h-4 mr-2" />
          ) : (
            <FileText className="w-4 h-4 mr-2" />
          )}
          {createPR ? "Create Pull Request" : "Commit to Repository"}
        </>
      )}
    </Button>
  );
}
