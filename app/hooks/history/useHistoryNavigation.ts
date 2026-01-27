import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { useHistoryStore } from "./useHistoryStore";

export function useHistoryNavigation() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const { setSearchQuery, setCurrentPage } = useHistoryStore();

  const updateURL = (params: Record<string, string>) => {
    startTransition(() => {
      const newParams = new URLSearchParams(searchParams);

      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          newParams.set(key, value);
        } else {
          newParams.delete(key);
        }
      });

      router.push(`/history?${newParams.toString()}`);
    });
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    updateURL({ search: value, page: "1" });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURL({ page: page.toString() });
  };

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  return {
    handleSearch,
    handlePageChange,
    handleRefresh,
    isPending,
  };
}
