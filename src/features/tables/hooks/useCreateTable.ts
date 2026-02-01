import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateTableInput } from "../schemas/tableSchemas";
import { tablesApi } from "@/services";
import { queryKeys } from "@/lib";

/**
 * useCreateTable Hook
 *
 * Create a new table and refresh the tables list
 */
export function useCreateTable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTableInput) => {
      const response = await tablesApi.createTable(data);
      return response.data;
    },

    // On success: invalidate ALL tables queries to force refresh
    onSuccess: () => {
      // Invalidate all queries that start with "tables"
      queryClient.invalidateQueries({ 
        queryKey: ["tables"],
        refetchType: "all",
      });
    },
  });
}
