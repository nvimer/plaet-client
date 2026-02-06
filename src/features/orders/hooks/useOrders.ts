import { queryKeys } from "@/lib";
import { orderApi } from "@/services";
import type { OrdersFilterParams, OrderSearchParams } from "@/services/orderApi";
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
        queryKey: queryKeys.orders.all(params),
        queryFn: async () => {
            const response = await orderApi.getOrders(params);
            return response.data;
        },
    });
}

/**
 * useKitchenOrders Hook
 *
 * Fetches orders for kitchen view with status filtering
 *
 * @param status - Status filter (comma-separated string)
 * @returns Query result with kitchen orders
 */
export function useKitchenOrders(status?: string) {
    return useQuery({
        queryKey: queryKeys.orders.kitchen(status),
        queryFn: async () => {
            const response = await orderApi.getKitchenOrders(status);
            return response.data;
        },
        // Refetch every 30 seconds for real-time updates
        refetchInterval: 30000,
    });
}

/**
 * useDailySales Hook
 *
 * Fetches daily sales summary and statistics
 *
 * @param date - Date for sales summary (YYYY-MM-DD)
 * @returns Query result with daily sales data
 */
export function useDailySales(date: string) {
    return useQuery({
        queryKey: queryKeys.orders.dailySales(date),
        queryFn: async () => {
            const response = await orderApi.getDailySales(date);
            return response.data;
        },
        // Cache for 5 minutes
        staleTime: 5 * 60 * 1000,
    });
}

/**
 * useOrderSearch Hook
 *
 * Full-text search for orders
 *
 * @param params - Search parameters
 * @returns Query result with search results
 */
export function useOrderSearch(params: OrderSearchParams) {
    return useQuery({
        queryKey: queryKeys.orders.search(params),
        queryFn: async () => {
            const response = await orderApi.searchOrders(params);
            return response.data;
        },
        // Don't cache search results
        staleTime: 0,
    });
}

/**
 * useTableAvailability Hook
 *
 * Check table availability for specific datetime
 *
 * @param tableId - Table ID
 * @param datetime - DateTime to check (ISO string)
 * @returns Query result with availability information
 */
export function useTableAvailability(tableId: number, datetime?: string) {
    return useQuery({
        queryKey: queryKeys.orders.tableAvailability(tableId, datetime),
        queryFn: async () => {
            const response = await orderApi.getTableAvailability(tableId, datetime);
            return response.data;
        },
        // Cache for 2 minutes
        staleTime: 2 * 60 * 1000,
        // Only run if tableId is provided
        enabled: !!tableId,
    });
}