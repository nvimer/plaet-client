import { tablesApi } from "@/services";
import { useQuery } from "@tanstack/react-query";
import type { PaginationParams } from "@/types/common";

/**
 * useTables Hook
 *
 * Fetches tables with pagination support
 *
 * @param params - Pagination params (page, limit)
 * @returns Tables data with pagination meta
 */
export function useTables(params?: PaginationParams) {
  // Default to high limit to get all tables (restaurants typically have <100 tables)
  const paginationParams: PaginationParams = {
    page: params?.page || 1,
    limit: params?.limit || 100,
  };

  return useQuery({
    queryKey: ["tables", paginationParams],
    queryFn: async () => {
      const response = await tablesApi.getTables(paginationParams);
      return {
        tables: response.data,
        meta: response.meta,
      };
    },
    retry: 2,
  });
}
