"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import LoginForm from "../../components/forms/Login";
import DescriptionSection from "@//components/DescriptionSection";

function LoginContent() {
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <DescriptionSection />
        {registered && (
          <div className="mb-6 bg-green-500/10 border border-green-500/50 rounded-lg p-4">
            <p className="text-green-400 text-sm text-center">
              Account created successfully! Please sign in.
            </p>
          </div>
        )}

        <LoginForm />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
