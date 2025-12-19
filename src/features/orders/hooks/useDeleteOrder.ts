import { queryKeys } from "@/lib";
import { orderApi } from "@/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * useDeleteOrder Hook
 *
 * Mutation to delete an order
 */
export function useDeleteOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await orderApi.deleteOrder(id);
            return id;
        },

        onSuccess: (deletedId) => {
            // Invalidate order list
            queryClient.invalidateQueries({
                queryKey: queryKeys.orders.all,
            });
            // Remove from cache
            queryClient.invalidateQueries({
                queryKey: queryKeys.orders.detail(deletedId),
            });
            // Invalidate tables
            queryClient.invalidateQueries({
                queryKey: queryKeys.tables.all,
            });
        },
    });
}
