"use client";
import { useDocsStore } from "@//lib/store/useDocStore";
import { DocTypeSelector } from "./input/DocumentTypeSelector";
import { InputMethodTabs } from "./input/InputTabs";
import { GithubInput } from "./input/GIthubInput";
import { CodeInput } from "./input/CodeInput";
import { FileUpload } from "./input/FileUpload";
import { ErrorAlert } from "./input/ErrorAlert";
import { GenerateButton } from "./input/GenerateBtn";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Separator } from "./ui/separator";

export default function InputSection() {
  const { inputMethod, error } = useDocsStore();

  return (
    <Card className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
      <CardHeader className="flex items-center justify-between">
        <h2 className="text-sm md:text-xl font-semibold text-black dark:text-white">
          Input Source
        </h2>
        <DocTypeSelector />
      </CardHeader>
      <Separator /> 
      <CardContent>
        <InputMethodTabs />
        <div className="mt-6">
          {inputMethod === "github" && <GithubInput />}
          {inputMethod === "code" && <CodeInput />}
          {inputMethod === "upload" && <FileUpload />}
        </div>
        {error && <ErrorAlert message={error} />}
      </CardContent>

      <CardFooter>
        <GenerateButton />
      </CardFooter>
    </Card>
  );
}
