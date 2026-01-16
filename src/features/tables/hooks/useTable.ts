import { tablesApi } from "@/services";
import { queryKeys } from "@/lib";
import { useQuery } from "@tanstack/react-query";

/**
 * useTable Hook
 * 
 * Fetches a single table by ID
 * 
 * @param id - Table ID
 * @returns Query result with table
 */
export function useTable(id: number | undefined) {
  return useQuery({
    queryKey: queryKeys.tables.detail(id || 0),
    queryFn: async () => {
      if (!id) throw new Error("Table ID is required");
      const response = await tablesApi.getTableById(id);
      return response.data;
    },
    enabled: !!id,
  });
}
