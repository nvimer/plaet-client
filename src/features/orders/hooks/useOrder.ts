import { queryKeys } from "@/lib";
import { orderApi } from "@/services";
import { useQuery } from "@tanstack/react-query";

/**
 * useOrder Hook
 *
 * Fetches a single order with full details
 *
 * @param id - Order ID
 * @returns Query result with order
 */
export function useOrder(id: string | undefined) {
    return useQuery({
        queryKey: queryKeys.orders.detail(id || ""),
        queryFn: async () => {
            if (!id) throw new Error("Order ID is required");
            const response = await orderApi.getOrderById(id);
            return response.data;
        },
        enabled: !!id, // Only run if id exists
    });
}
