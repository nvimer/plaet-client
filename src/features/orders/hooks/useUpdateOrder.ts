import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type UpdateOrderInput } from "@/types";
import { orderApi } from "@/services";
import { queryKeys } from "@/lib";

/**
 * useUpdateOrder Hook
 *
 * Mutation to update an existing order
 */
export function useUpdateOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            ...orderData
        }: UpdateOrderInput & { id: string }) => {
            const response = await orderApi.updateOrder(id, orderData);
            return response.data;
        },

        onSuccess: (updatedOrder) => {
            // Invalidate list
            queryClient.invalidateQueries({
                queryKey: queryKeys.orders.all,
            });

            // Invalidate detail
            queryClient.invalidateQueries({
                queryKey: queryKeys.orders.detail(updatedOrder.id),
            });
        },
    });
}
