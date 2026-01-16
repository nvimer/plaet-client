import { menuApi } from "@/services";
import { queryKeys } from "@/lib";
import { useQuery } from "@tanstack/react-query";

/**
 * useMenuItem Hook
 * 
 * Fetches a single menu item by ID
 * 
 * @param id - Menu item ID
 * @returns Query result with menu item
 */
export function useMenuItem(id: number | undefined) {
  return useQuery({
    queryKey: queryKeys.menu.detail(id || 0),
    queryFn: async () => {
      if (!id) throw new Error("Menu item ID is required");
      const response = await menuApi.getMenuItemById(id);
      return response.data;
    },
    enabled: !!id,
  });
}
