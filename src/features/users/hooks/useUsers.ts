import { usersApi } from "@/services";
import { queryKeys } from "@/lib";
import { useQuery } from "@tanstack/react-query";
import type { PaginationParams } from "@/types";
import { ITEMS_PER_PAGE } from "@/config/constants";

/**
 * useUsers Hook
 * 
 * Fetches paginated list of users
 * 
 * @param params - Pagination parameters (optional, defaults to page 1, limit from config)
 * @returns Query result with users
 */
export function useUsers(params?: PaginationParams) {
  return useQuery({
    queryKey: queryKeys.users?.all(params) || ["users", params],
    queryFn: async () => {
      // getUsers will provide defaults if params not provided
      const response = await usersApi.getUsers(params);
      // response is PaginatedResponse<User>, so response.data is the array
      return response.data || [];
    },
    staleTime: 30000, // 30 seconds
  });
}
