"use client";

import { DocType } from "@//lib/@types/common";
import { useDocsStore } from "@//lib/store/useDocStore";
import { DOC_TYPES } from "@/app/lib/constants";
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
      <SelectTrigger>
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
