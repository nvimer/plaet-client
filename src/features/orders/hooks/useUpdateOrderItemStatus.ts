import { queryKeys } from "@/lib";
import { orderApi } from "@/services";
import { OrderItemStatus } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * useUpdateOrderItemStatus Hook
 *
 * Mutation to update individual order item status
 */
export function useUpdateOrderItemStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            orderId,
            itemId,
            status,
        }: {
            orderId: string;
            itemId: number;
            status: OrderItemStatus;
        }) => {
            const response = await orderApi.updateOrderItemStatus(orderId, itemId, status);
            return response.data;
        },

        onSuccess: (_updatedItem, variables) => {
            // Invalidate all order queries
            queryClient.invalidateQueries({
                queryKey: ["orders"],
            });
            // Also invalidate kitchen orders if they exist as a separate key
            queryClient.invalidateQueries({
                queryKey: ["orders", "kitchen"],
            });
            queryClient.invalidateQueries({
                queryKey: queryKeys.orders.detail(variables.orderId),
            });
        },
    });
}
