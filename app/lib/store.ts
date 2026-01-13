'use client';

import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { DocsState, InputMethod, DocType } from './types';
import { EXAMPLE_GITHUB_URL, EXAMPLE_CODE } from './constants';

export const useDocsStore = create<DocsState>()(
  devtools(
    persist(
      (set) => ({
        inputMethod: 'github',
        docType: 'readme',
        githubUrl: EXAMPLE_GITHUB_URL,
        codeInput: EXAMPLE_CODE,
        generatedDocs: '',
        isGenerating: false,
        error: null,

        setInputMethod: (method: InputMethod) =>
          set({ inputMethod: method, error: null }),

        setDocType: (type: DocType) =>
          set({ docType: type }),

        setGithubUrl: (url: string) =>
          set({ githubUrl: url, error: null }),

        setCodeInput: (code: string) =>
          set({ codeInput: code, error: null }),

        setGeneratedDocs: (docs: string) =>
          set({ generatedDocs: docs }),

        setIsGenerating: (isGenerating: boolean) =>
          set({ isGenerating }),

        setError: (error: string | null) =>
          set({ error }),

        reset: () =>
          set({
            generatedDocs: '',
            error: null,
            isGenerating: false,
          }),
      }),
      {
        name: 'docs-generator-storage',
        partialize: (state) => ({
          inputMethod: state.inputMethod,
          docType: state.docType,
          githubUrl: state.githubUrl,
          codeInput: state.codeInput,
        }),
      }
    ),
    { name: 'DocsStore' }
  )
);