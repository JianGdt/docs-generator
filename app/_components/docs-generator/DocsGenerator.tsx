"use client";

import React from "react";
import InputSection from "./InputSection";
import PreviewSection from "./PreviewSection";
import Header from "../layout/Header";

export default function DocsGenerator() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-purple-900">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <InputSection />
          <PreviewSection />
        </div>
      </div>
    </div>
  );
}
