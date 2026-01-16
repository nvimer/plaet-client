import { rolesApi } from "@/services";
import { queryKeys } from "@/lib";
import { useQuery } from "@tanstack/react-query";

/**
 * useRoles Hook
 * 
 * Fetches list of available roles
 * Used for role selection in user forms
 */
export function useRoles() {
  return useQuery({
    queryKey: queryKeys.roles?.all() || ["roles"],
    queryFn: async () => {
      const response = await rolesApi.getRoles();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - roles don't change often
  });
}
