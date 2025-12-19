import { queryKeys } from "@/lib";
import { orderApi } from "@/services";
import type { OrdersFilterParams } from "@/services/orderApi";
import { useQuery } from "@tanstack/react-query";

/**
 * useOrders Hook
 *
 * Fetches paginated list of orders with optional filters
 *
 * @param params - Filter and pagination params
 * @returns Query result with orders
 */
export function useOrders(params?: OrdersFilterParams) {
    return useQuery({
        queryKey: [...queryKeys.orders.all, params],
        queryFn: async () => {
            const response = await orderApi.getOrders(params);
            return response.data;
        },
    });
}
