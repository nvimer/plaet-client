import { queryKeys } from "@/lib";
import { orderApi } from "@/services";
import type { CreateOrderInput } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * useCreateOrder Hook
 *
 * Mutation to create a new order
 */
export function useCreateOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (orderData: CreateOrderInput) => {
            const response = await orderApi.createOrder(orderData);
            return response.data;
        },

        onSuccess: () => {
            // Invalidate orders list to refetch
            queryClient.invalidateQueries({
                queryKey: queryKeys.orders.all,
            });
            // Also invalidate tables if order is DINE-IN
            queryClient.invalidateQueries({
                queryKey: queryKeys.tables.all,
            });
        },
    });
}
