"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { FormFieldWrapper } from "./FormWrapper";
import { PasswordInput } from "../input/PasswordInput";
import { OAuthButtons } from "../OAuthBtn";
import { LoginFormValues, loginSchema } from "@//lib/schema/auth";

interface LoginFormProps {
  onSwitchToRegister?: () => void;
}

export default function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");

  const urlError = searchParams.get("error");

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setError("");
    try {
      const result = await signIn("credentials", {
        identifier: values.identifier,
        password: values.password,
        redirect: false,
      });

      if (result?.ok) {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  const isLoading = form.formState.isSubmitting;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl text-black dark:text-white text-start">
          Login
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {(error || urlError) && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error || urlError === "CredentialsSignin"
                ? "Invalid username/email or password"
                : "An error occurred during sign in"}
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormFieldWrapper
              control={form.control}
              name="identifier"
              label="Username or Email"
            >
              {(field) => (
                <Input
                  placeholder="Enter your username or email"
                  {...field}
                  disabled={isLoading}
                  className=" text-black dark:text-white"
                />
              )}
            </FormFieldWrapper>

            <FormFieldWrapper
              control={form.control}
              name="password"
              label="Password"
            >
              {(field) => <PasswordInput {...field} disabled={isLoading} />}
            </FormFieldWrapper>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>

        <OAuthButtons disabled={isLoading} callbackUrl="/" onError={setError} />

        <p className="text-center text-sm text-slate-400">
          Don't have an account?{" "}
          {onSwitchToRegister ? (
            <Button onClick={onSwitchToRegister} type="button" variant="link">
              Create one
            </Button>
          ) : (
            <Link href="/register" className="text-blue-500 hover:underline">
              Create one
            </Link>
          )}
        </p>
      </CardContent>
    </Card>
  );
}
