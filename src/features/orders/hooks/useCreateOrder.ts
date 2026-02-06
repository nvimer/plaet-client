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
            // Invalidate orders list to refetch (all variations)
            queryClient.invalidateQueries({
                queryKey: ["orders"],
            });
            // Also invalidate tables if order is DINE-IN
            queryClient.invalidateQueries({
                queryKey: queryKeys.tables.all,
            });
        },
    });
}

/**
 * useUpdateOrderItem Hook
 *
 * Mutation to update order item quantity and details
 */
export function useUpdateOrderItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ orderId, itemId, updateData }: {
            orderId: string;
            itemId: number;
            updateData: Parameters<typeof orderApi.updateOrderItem>[2];
        }) => {
            const response = await orderApi.updateOrderItem(orderId, itemId, updateData);
            return response.data;
        },

        onSuccess: (_, variables) => {
            // Invalidate specific order
            queryClient.invalidateQueries({
                queryKey: queryKeys.orders.detail(variables.orderId),
            });
            // Also invalidate orders list
            queryClient.invalidateQueries({
                queryKey: ["orders"],
            });
        },
    });
}

/**
 * useBatchOrderStatusUpdate Hook
 *
 * Mutation to update status for multiple orders at once
 */
export function useBatchOrderStatusUpdate() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (batchData: Parameters<typeof orderApi.updateBatchOrderStatus>[0]) => {
            const response = await orderApi.updateBatchOrderStatus(batchData);
            return response.data;
        },

        onSuccess: () => {
            // Invalidate all orders queries
            queryClient.invalidateQueries({
                queryKey: ["orders"],
            });
        },
    });
}

/**
 * useDuplicateOrder Hook
 *
 * Mutation to duplicate an existing order
 */
export function useDuplicateOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ orderId, options }: {
            orderId: string;
            options?: Parameters<typeof orderApi.duplicateOrder>[1];
        }) => {
            const response = await orderApi.duplicateOrder(orderId, options);
            return response.data;
        },

        onSuccess: () => {
            // Invalidate orders list
            queryClient.invalidateQueries({
                queryKey: ["orders"],
            });
        },
    });
}

/**
 * useValidateOrder Hook
 *
 * Mutation to validate order data before creation
 */
export function useValidateOrder() {
    return useMutation({
        mutationFn: async (orderData: CreateOrderInput) => {
            const response = await orderApi.validateOrder(orderData);
            return response.data;
        },
        // Don't invalidate cache on validation
    });
}

/**
 * useCancelOrder Hook
 *
 * Mutation to cancel order with reason
 */
export function useCancelOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ orderId, cancelData }: {
            orderId: string;
            cancelData: Parameters<typeof orderApi.cancelOrder>[1];
        }) => {
            const response = await orderApi.cancelOrder(orderId, cancelData);
            return response.data;
        },

        onSuccess: (_, variables) => {
            // Invalidate specific order
            queryClient.invalidateQueries({
                queryKey: queryKeys.orders.detail(variables.orderId),
            });
            // Also invalidate orders list
            queryClient.invalidateQueries({
                queryKey: ["orders"],
            });
        },
    });
}