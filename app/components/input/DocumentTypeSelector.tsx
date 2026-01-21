"use client";

import { useDocsStore } from "@/app/lib/store";
import { DOC_TYPES } from "@/app/lib/constants";
import { DocType } from "@/app/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function DocTypeSelector() {
  const { docType, setDocType, isGenerating } = useDocsStore();

  return (
    <Select
      value={docType}
      onValueChange={(value) => setDocType(value as DocType)}
      disabled={isGenerating}
    >
      <SelectTrigger className="w-[180px] bg-slate-700 text-white border-slate-600 focus:border-blue-500 focus:ring-blue-500/50">
        <SelectValue placeholder="Select doc type" />
      </SelectTrigger>
      <SelectContent className="bg-slate-800 border-slate-700">
        {Object.entries(DOC_TYPES).map(([key, label]) => (
          <SelectItem
            key={key}
            value={key}
            className="text-white focus:bg-slate-700 focus:text-white"
          >
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
