import { HistoryStore } from "@//lib/@types/store";
import { create } from "zustand";

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
