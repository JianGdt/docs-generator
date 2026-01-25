"use client";

import { useDocsStore } from "@//lib/store/useDocStore";
import { inputMethods } from "@/app/lib/constants";
import { Tabs, TabsList, TabsTrigger } from "@//components/ui/tabs";
import { InputMethod } from "@//lib/@types/common";

export function InputMethodTabs() {
  const { inputMethod, setInputMethod, isGenerating } = useDocsStore();

  return (
    <Tabs
      value={inputMethod}
      onValueChange={(value) => setInputMethod(value as InputMethod)}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-3 h-auto p-1">
        {inputMethods?.map((method) => (
          <TabsTrigger
            key={method.id}
            value={method.id}
            disabled={isGenerating}
          >
            <method.icon className="hidden md:flex w-4 h-4" />
            <span className="px-2 py-0.5 text-xs">{method.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
