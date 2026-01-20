"use client";

import { create } from "zustand";

interface HistoryRefetchStore {
  refetchTrigger: number;
  triggerRefetch: () => void;
}

export const useHistoryRefetch = create<HistoryRefetchStore>((set) => ({
  refetchTrigger: 0,
  triggerRefetch: () =>
    set((state) => ({ refetchTrigger: state.refetchTrigger + 1 })),
}));
