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
      try {
        // getUsers will provide defaults if params not provided
        const response = await usersApi.getUsers(params);
        console.log("🔍 useUsers - Full Response:", response);
        console.log("🔍 useUsers - response.data:", response.data);
        console.log("🔍 useUsers - response.data type:", typeof response.data);
        console.log("🔍 useUsers - response.data isArray?", Array.isArray(response.data));
        
        // getUsers returns PaginatedResponse<User> which has structure:
        // { success, message, data: User[], meta: {...} }
        // But the backend might be wrapping it differently
        let users: any[] = [];
        
        if (Array.isArray(response)) {
          // If response is already an array, use it directly
          users = response;
        } else if (response?.data) {
          if (Array.isArray(response.data)) {
            // If response.data is an array, use it
            users = response.data;
          } else if (response.data.data && Array.isArray(response.data.data)) {
            // If response.data.data is an array (double wrapped), use it
            users = response.data.data;
          } else if (response.data.users && Array.isArray(response.data.users)) {
            // If response.data.users is an array, use it
            users = response.data.users;
          }
        }
        
        console.log("🔍 useUsers - Extracted users array:", users);
        console.log("🔍 useUsers - Is array?", Array.isArray(users));
        console.log("🔍 useUsers - Array length:", users.length);
        
        return users;
      } catch (error) {
        console.error("❌ useUsers - Error:", error);
        throw error;
      }
    },
    staleTime: 30000, // 30 seconds
  });
}
