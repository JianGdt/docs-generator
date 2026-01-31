"use client";

import { signIn } from "next-auth/react";
import { Github, Chrome } from "lucide-react";
import { Button } from "./ui/button";

interface OAuthButtonsProps {
  disabled?: boolean;
  callbackUrl?: string;
  onError?: (error: string) => void;
}

export function OAuthButtons({
  disabled = false,
  callbackUrl = "/",
  onError,
}: OAuthButtonsProps) {
  const handleOAuthSignIn = async (provider: "google" | "github") => {
    try {
      await signIn(provider, { callbackUrl });
    } catch (error) {
      onError?.("OAuth sign in failed. Please try again.");
    }
  };

  return (
    <>
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={() => handleOAuthSignIn("google")}
          disabled={disabled}
        >
          <Chrome className="h-4 w-4" />
          Google
        </Button>

        <Button
          variant="outline"
          onClick={() => handleOAuthSignIn("github")}
          disabled={disabled}
        >
          <Github className="h-4 w-4" />
          GitHub
        </Button>
      </div>
    </>
  );
}
