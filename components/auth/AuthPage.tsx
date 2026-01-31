"use client";

import { Suspense } from "react";
import { AuthContent } from "../motion/AnimationContent";

export default function AuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthContent />
    </Suspense>
  );
}
