import { menuApi } from "@/services";
import { queryKeys } from "@/lib";
import { useQuery } from "@tanstack/react-query";

/**
 * useCategory Hook
 * 
 * Fetches a single category by ID
 * 
 * @param id - Category ID
 * @returns Query result with category
 */
export function useCategory(id: number | undefined) {
  return useQuery({
    queryKey: queryKeys.categories.detail(id || 0),
    queryFn: async () => {
      if (!id) throw new Error("Category ID is required");
      const response = await menuApi.getCategoryById(id);
      return response.data;
    },
    enabled: !!id,
  });
}
