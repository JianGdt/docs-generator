"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  Github,
  Chrome,
  AlertCircle,
  EyeOff,
  Eye,
  EyeClosed,
} from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const urlError = searchParams.get("error");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const identifier = formData.get("identifier") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signIn("credentials", {
        identifier,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        router.push("/docs-generator");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: "google" | "github") => {
    setLoading(true);
    setError("");
    try {
      await signIn(provider, {
        callbackUrl: "/docs-generator",
      });
    } catch (err) {
      setError("OAuth sign-in failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-slate-800/50 border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-2xl text-white text-center">
          Welcome Back
        </CardTitle>
        <p className="text-slate-400 text-center text-sm mt-2">
          Sign in to continue to AI Docs Generator
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {(error || urlError) && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error || urlError === "CredentialsSignin"
                ? "Invalid username/email or password"
                : error || "An error occurred during sign in"}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-slate-300 mb-2 block">
              Username or Email
            </label>
            <Input
              name="identifier"
              type="text"
              placeholder="player2"
              required
              className="bg-slate-700/50 border-slate-600 text-white"
              disabled={loading}
            />
          </div>

          <div>
            <label className="text-sm text-slate-300 mb-2 block">
              Password
            </label>
            <div className="relative">
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                className="bg-slate-700/50 border-slate-600 text-white pr-10"
                disabled={loading}
              />
              <Button
                type="button"
                variant="link"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 cursor-pointer -translate-y-1/2 bg-transparent text-slate-400"
                disabled={loading}
              >
                {showPassword ? (
                  <EyeClosed className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-600" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-slate-800 px-2 text-slate-400">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            onClick={() => handleOAuthSignIn("google")}
            disabled={loading}
            className="bg-slate-700/50 border-slate-600 hover:bg-slate-700"
          >
            <Chrome className="mr-2 h-4 w-4" />
            Google
          </Button>
          <Button
            variant="outline"
            onClick={() => handleOAuthSignIn("github")}
            disabled={loading}
            className="bg-slate-700/50 border-slate-600 hover:bg-slate-700"
          >
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </Button>
        </div>

        <p className="text-center text-sm text-slate-400">
          Don't have an account?{" "}
          <a href="/register" className="text-purple-400 hover:underline">
            Create one
          </a>
        </p>
      </CardContent>
    </Card>
  );
}
