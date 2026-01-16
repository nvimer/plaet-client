import { usersApi } from "@/services";
import { queryKeys } from "@/lib";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { RegisterInput } from "@/types";

/**
 * useCreateUser Hook
 * 
 * Mutation to create a new user
 */
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: RegisterInput) => {
      const response = await usersApi.registerUser(userData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.users?.all() || ["users"],
      });
    },
  });
}
