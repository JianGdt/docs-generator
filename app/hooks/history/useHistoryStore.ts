import { DocHistoryEntry, DocHistoryEntryClient, Pagination } from "@//lib/@types/history";
import { create } from "zustand";

interface HistoryStore {
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

const initialState = {
  documents: [],
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  searchQuery: "",
  currentPage: 1,
  isLoading: false,
};

export const useHistoryStore = create<HistoryStore>((set) => ({
  ...initialState,
  setDocuments: (documents) => set({ documents }),
  setPagination: (pagination) => set({ pagination }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setCurrentPage: (currentPage) => set({ currentPage }),
  setIsLoading: (isLoading) => set({ isLoading }),
  reset: () => set(initialState),
}));
