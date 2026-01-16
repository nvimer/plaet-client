import { queryKeys } from "@/lib";
import { orderApi } from "@/services";
import { OrderStatus } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * useUpdateOrderStatus Hook
 *
 * Mutation to update only the order status
 */
export function useUpdateOrderStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            orderStatus,
        }: {
            id: string;
            orderStatus: OrderStatus;
        }) => {
            const response = await orderApi.updateOrderStatus(id, {
                status: orderStatus,
            });
            return response.data;
        },

        onSuccess: (updatedOrder) => {
            // Invalidate all order queries
            queryClient.invalidateQueries({
                queryKey: ["orders"],
            });
            queryClient.invalidateQueries({
                queryKey: queryKeys.orders.detail(updatedOrder.id),
            });
            // If status affects table, invalidate tables
            queryClient.invalidateQueries({
                queryKey: queryKeys.tables.all,
            });
        },
    });
}
