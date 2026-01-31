"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { Input } from "../ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import { RegisterFormValues, registerSchema } from "../../lib/schema/auth";
import { FormFieldWrapper } from "./FormWrapper";
import { PasswordInput } from "../input/PasswordInput";
import { OAuthButtons } from "../OAuthBtn";
import Link from "next/link";
import { toast } from "sonner";
import { endpoints } from "@//lib/api/endpoints";

interface RegisterFormProps {
  onSwitchToLogin?: () => void;
}

export default function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setError("");
    try {
      const response = await endpoints.register({
        username: values.username,
        email: values.email,
        password: values.password,
      });

      if (!response.success) {
        setError(
          response.error?.message || "Registration failed. Please try again.",
        );
        return;
      }

      const signInResult = await signIn("credentials", {
        identifier: values.username,
        password: values.password,
        redirect: false,
      });

      if (signInResult?.error) {
        router.push("/login");
      } else {
        toast.success("Account created successfully!");
        router.push("/");
        router.refresh();
      }
    } catch (error: any) {
      toast.error("Registration failed. Please try again.");
      setError(error.message || "An error occurred. Please try again.");
    }
  };

  const isLoading = form.formState.isSubmitting;

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-black dark:text-white text-start">
          Create Account
        </CardTitle>
        <CardDescription className="text-start">
          Start generating docs with AI
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormFieldWrapper
              control={form.control}
              name="username"
              label="Username"
              description="3-20 characters, letters, numbers, and underscores only"
            >
              {(field) => (
                <Input placeholder="johndoe" {...field} disabled={isLoading} />
              )}
            </FormFieldWrapper>

            <FormFieldWrapper
              control={form.control}
              name="email"
              label="Email Address"
            >
              {(field) => (
                <Input
                  type="email"
                  placeholder="you@example.com"
                  {...field}
                  disabled={isLoading}
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

            <FormFieldWrapper
              control={form.control}
              name="confirmPassword"
              label="Confirm Password"
            >
              {(field) => <PasswordInput {...field} disabled={isLoading} />}
            </FormFieldWrapper>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </Form>

        <OAuthButtons disabled={isLoading} callbackUrl="/" onError={setError} />

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          {onSwitchToLogin ? (
            <Button onClick={onSwitchToLogin} type="button" variant="link">
              Sign in
            </Button>
          ) : (
            <Link
              href="/login"
              className="text-black dark:text-white hover:underline"
            >
              Sign in
            </Link>
          )}
        </p>
      </CardContent>
    </Card>
  );
}
