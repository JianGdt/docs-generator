import { DocType, InputMethod } from "./common";
import { DocHistoryEntryClient, Pagination } from "./history";

export interface UploadedFileData {
  id: string;
  fileName: string;
  fileSize: number;
  content: string;
}

export interface DocsState {
  inputMethod: InputMethod;
  docType: DocType;
  githubUrl: string;
  codeInput: string;
  generatedDocs: string;
  isGenerating: boolean;
  error: string | null;

  uploadedFiles: UploadedFileData[];

  setUploadedFiles: (files: UploadedFileData[]) => void;
  setInputMethod: (method: InputMethod) => void;
  setDocType: (type: DocType) => void;
  setGithubUrl: (url: string) => void;
  setCodeInput: (code: string) => void;
  setGeneratedDocs: (docs: string) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export interface HistoryStore {
  documents: DocHistoryEntryClient[];
  pagination: Pagination;
  searchQuery: string;
  currentPage: number;
  isLoading: boolean;

  setDocuments: (documents: DocHistoryEntryClient[]) => void;
  setPagination: (pagination: Pagination) => void;
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
  setIsLoading: (loading: boolean) => void;
  reset: () => void;
}
