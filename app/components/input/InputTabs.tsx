"use client";

import { useDocsStore } from "@/app/lib/store";
import { InputMethod } from "@/app/lib/types";
import { inputMethods } from "@/app/lib/constants";
import { Tabs, TabsList, TabsTrigger } from "@//components/ui/tabs";

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
            <method.icon className="w-4 h-4" />
            <span className="text-sm">{method.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
