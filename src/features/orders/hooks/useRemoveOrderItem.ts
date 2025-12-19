import { queryKeys } from "@/lib";
import { orderApi } from "@/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * useRemoveOrderItem Hook
 * Mutation to remove an item from an order
 */
export function useRemoveOrderItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            orderId,
            itemId,
        }: {
            orderId: string;
            itemId: number;
        }) => {
            const response = await orderApi.removeOrderItem(orderId, itemId);
            return response.data;
        },

        onSuccess: (updatedOrder) => {
            // Invalidate order detail
            queryClient.invalidateQueries({
                queryKey: queryKeys.orders.detail(updatedOrder.id),
            });
            // Invalidate orders list
            queryClient.invalidateQueries({
                queryKey: queryKeys.orders.all,
            });
        },
    });
}
