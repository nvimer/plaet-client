import { usersApi } from "@/services";
import { queryKeys } from "@/lib";
import { useQuery } from "@tanstack/react-query";

/**
 * useUser Hook
 * 
 * Fetches a single user by ID
 * 
 * @param id - User ID
 * @returns Query result with user
 */
export function useUser(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.users?.detail(id || "") || ["users", id],
    queryFn: async () => {
      if (!id) throw new Error("User ID is required");
      const response = await usersApi.getUserById(id);
      return response.data;
    },
    enabled: !!id,
  });
}
