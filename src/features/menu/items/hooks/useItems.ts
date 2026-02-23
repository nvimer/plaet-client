import { useState, useCallback, useEffect } from "react";
import { menuApi } from "@/services";
import { queryKeys } from "@/lib";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { PaginatedResponse, MenuItem } from "@/types";

export type ItemsPerPage = 10 | 20 | 50 | 100;

export interface UseItemsPaginationReturn {
  items: PaginatedResponse<MenuItem> | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  page: number;
  limit: ItemsPerPage;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  setPage: (page: number) => void;
  setLimit: (limit: ItemsPerPage) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  refetch: () => void;
}

export function useItemsPagination(
  initialPage: number = 1,
  initialLimit: ItemsPerPage = 10,
  categoryId?: number | string,
): UseItemsPaginationReturn {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState<ItemsPerPage>(initialLimit);

  // Reset page when category filter changes
  useEffect(() => {
    setPage(1);
  }, [categoryId]);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [...queryKeys.menu.all, page, limit, categoryId],
    queryFn: async () => {
      const params: any = { page, limit };
      if (categoryId) params.categoryId = categoryId;
      const response = await menuApi.getMenuItems(params);
      return response;
    },
    placeholderData: keepPreviousData,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  const totalItems = data?.meta?.total ?? 0;
  const totalPages = data?.meta?.totalPages ?? 1;
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  const goToNextPage = useCallback(() => {
    if (hasNextPage) setPage((prev) => prev + 1);
  }, [hasNextPage]);

  const goToPreviousPage = useCallback(() => {
    if (hasPreviousPage) setPage((prev) => prev - 1);
  }, [hasPreviousPage]);

  const goToFirstPage = useCallback(() => setPage(1), []);
  const goToLastPage = useCallback(() => {
    if (totalPages > 1) setPage(totalPages);
  }, [totalPages]);

  return {
    items: data,
    isLoading,
    isError,
    error: error as Error | null,
    page,
    limit,
    totalItems,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    setPage,
    setLimit,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    refetch,
  };
}

// Original hook for backward compatibility - shows all items without pagination
export function useItems() {
  return useQuery({
    queryKey: queryKeys.menu.all,
    queryFn: async () => {
      const response = await menuApi.getMenuItems({ page: 1, limit: 100 });
      return response.data;
    },
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
}
