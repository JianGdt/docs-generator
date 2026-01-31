"use client";

import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import { Github, AlertCircle } from "lucide-react";

interface GitHubSignInCardProps {
  currentProvider?: string;
}

export function GitHubSignInCard({ currentProvider }: GitHubSignInCardProps) {
  const handleSignIn = () => {
    window.location.href = "/api/auth/signin/github";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-black dark:text-white">
          <Github className="w-5 h-5" />
          GitHub Integration
        </CardTitle>
      </CardHeader>
      <CardContent>
        {currentProvider && currentProvider !== "github" && (
          <Alert className="bg-blue-500/10 border-blue-500/50 mb-4">
            <AlertCircle className="h-4 w-4 text-black dark:text-white" />
            <AlertDescription className="text-black dark:text-white">
              You're signed in with {currentProvider}. To use GitHub
              integration, please sign in with GitHub.
            </AlertDescription>
          </Alert>
        )}

        <p className="text-black dark:text-white text-sm mb-4">
          Connect your GitHub account to commit documentation directly to your
          repositories.
        </p>

        <Button
          onClick={handleSignIn}
          variant="outline"
          className="cursor-pointer"
        >
          <Github className="w-4 h-4 mr-2" />
          Sign in with GitHub
        </Button>
      </CardContent>
    </Card>
  );
}
