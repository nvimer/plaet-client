import { usersApi } from "@/services";
import { queryKeys } from "@/lib";
import { useQuery } from "@tanstack/react-query";
import type { PaginationParams } from "@/types";

/**
 * useUsers Hook
 *
 * Fetches paginated list of users
 *
 * @param params - Pagination parameters (optional, defaults to page 1, limit 20)
 * @returns Query result with users
 */
export function useUsers(params?: PaginationParams) {
  return useQuery({
    queryKey: queryKeys.users?.all(params) || ["users", params],
    queryFn: async () => {
      const response = await usersApi.getUsers(params);
      // Backend returns PaginatedResponse<User> with structure: { data: User[], meta: {...} }
      return response.data || [];
    },
    staleTime: 30000, // 30 seconds
  });
}
