import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type CreateOrderItemInput } from "@/types";
import { orderApi } from "@/services";
import { queryKeys } from "@/lib";

/**
 * useAddOrderItem Hook
 *
 * Mutation to add and item to an existing order
 */
export function useAddOrderItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            orderId,
            itemData,
        }: {
            orderId: string;
            itemData: CreateOrderItemInput;
        }) => {
            const response = await orderApi.addOrderItem(orderId, itemData);
            return response.data;
        },

        onSuccess: (updatedOrder) => {
            // Invalidate order detail
            queryClient.invalidateQueries({
                queryKey: queryKeys.orders.detail(updatedOrder.id),
            });
            // Invalidate all orders queries
            queryClient.invalidateQueries({
                queryKey: ["orders"],
            });
        },
    });
}
