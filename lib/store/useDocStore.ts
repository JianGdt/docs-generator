"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { DocsState } from "../@types/store";
import { DocType, InputMethod } from "../@types/common";

export const useDocsStore = create<DocsState>()(
  devtools(
    (set) => ({
      inputMethod: "github",
      docType: "readme",

      githubUrl: "",
      codeInput: "",

      generatedDocs: "",
      isGenerating: false,
      error: null,

      uploadedFiles: [],
      setUploadedFiles: (files) => set({ uploadedFiles: files }),

      setInputMethod: (method: InputMethod) =>
        set({ inputMethod: method, error: null }),

      setDocType: (type: DocType) => set({ docType: type }),

      setGithubUrl: (url: string) => set({ githubUrl: url, error: null }),

      setCodeInput: (code: string) => set({ codeInput: code, error: null }),

      setGeneratedDocs: (docs: string) => set({ generatedDocs: docs }),

      setIsGenerating: (isGenerating: boolean) => set({ isGenerating }),

      setError: (error: string | null) => set({ error }),

      reset: () =>
        set({
          generatedDocs: "",
          error: null,
        }),
    }),
    { name: "DocsStore" },
  ),
);
