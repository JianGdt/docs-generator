"use client";

import { Button } from "../../../components/ui/button";
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
    <Button type="submit" disabled={disabled} variant="outline">
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
