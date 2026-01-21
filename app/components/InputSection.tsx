"use client";
import { useDocsStore } from "@/app/lib/store";
import { DocTypeSelector } from "./input/DocumentTypeSelector";
import { InputMethodTabs } from "./input/InputTabs";
import { GithubInput } from "./input/GIthubInput";
import { CodeInput } from "./input/CodeInput";
import { FileUpload } from "./input/FileUpload";
import { ErrorAlert } from "./input/ErrorAlert";
import { GenerateButton } from "./input/GenerateBtn";

export default function InputSection() {
  const { inputMethod, error } = useDocsStore();

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-blue-500/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Input Source</h2>
        <DocTypeSelector />
      </div>

      <InputMethodTabs />
      <div className="mt-6">
        {inputMethod === "github" && <GithubInput />}
        {inputMethod === "code" && <CodeInput />}
        {inputMethod === "upload" && <FileUpload />}
      </div>
      {error && <ErrorAlert message={error} />}
      <GenerateButton />
    </div>
  );
}
