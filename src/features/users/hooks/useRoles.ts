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
      try {
        const response = await rolesApi.getRoles();
        console.log("🔍 useRoles - Full Response:", response);
        console.log("🔍 useRoles - response.data:", response.data);
        console.log("🔍 useRoles - response.data type:", typeof response.data);
        console.log("🔍 useRoles - response.data isArray?", Array.isArray(response.data));
        
        // getRoles returns PaginatedResponse<Role> which has structure:
        // { success, message, data: Role[], meta: {...} }
        // But the backend might be wrapping it differently
        let roles: any[] = [];
        
        if (Array.isArray(response)) {
          // If response is already an array, use it directly
          roles = response;
        } else if (response?.data) {
          if (Array.isArray(response.data)) {
            // If response.data is an array, use it
            roles = response.data;
          } else if (response.data.data && Array.isArray(response.data.data)) {
            // If response.data.data is an array (double wrapped), use it
            roles = response.data.data;
          } else if (response.data.roles && Array.isArray(response.data.roles)) {
            // If response.data.roles is an array, use it
            roles = response.data.roles;
          }
        }
        
        console.log("🔍 useRoles - Extracted roles array:", roles);
        console.log("🔍 useRoles - Is array?", Array.isArray(roles));
        console.log("🔍 useRoles - Array length:", roles.length);
        
        return roles;
      } catch (error) {
        console.error("❌ useRoles - Error:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - roles don't change often
  });
}
