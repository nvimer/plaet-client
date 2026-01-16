import { usersApi } from "@/services";
import { queryKeys } from "@/lib";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateUserInput } from "@/types";

/**
 * useUpdateUser Hook
 * 
 * Mutation to update a user
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateUserInput;
    }) => {
      const response = await usersApi.updateUser(id, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.users?.all() || ["users"],
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.users?.detail(variables.id) || [
          "users",
          variables.id,
        ],
      });
    },
  });
}
