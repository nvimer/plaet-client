import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { menuApi } from "@/services";
import { queryKeys } from "@/lib/queryClient";
import type { AddStockInput, RemoveStockInput } from "@/types";

/**
 * useAddStock Hook
 *
 * Mutation to add stock to a menu item
 */
export function useAddStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      stockData,
    }: {
      id: number;
      stockData: AddStockInput;
    }) => {
      const response = await menuApi.addStock(id, stockData);
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate item queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.menu.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.menu.all,
      });
      // Invalidate stock-related queries
      queryClient.invalidateQueries({
        queryKey: ["menu", "items", "low-stock"],
      });
      queryClient.invalidateQueries({
        queryKey: ["menu", "items", "out-of-stock"],
      });
      queryClient.invalidateQueries({
        queryKey: ["menu", "items", variables.id, "stock", "history"],
      });
    },
  });
}

/**
 * useRemoveStock Hook
 *
 * Mutation to remove stock from a menu item
 */
export function useRemoveStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      stockData,
    }: {
      id: number;
      stockData: RemoveStockInput;
    }) => {
      const response = await menuApi.removeStock(id, stockData);
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate item queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.menu.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.menu.all,
      });
      // Invalidate stock-related queries
      queryClient.invalidateQueries({
        queryKey: ["menu", "items", "low-stock"],
      });
      queryClient.invalidateQueries({
        queryKey: ["menu", "items", "out-of-stock"],
      });
      queryClient.invalidateQueries({
        queryKey: ["menu", "items", variables.id, "stock", "history"],
      });
    },
  });
}

/**
 * useStockHistory Hook
 *
 * Query to get stock history for a menu item
 */
export function useStockHistory(
  itemId: number,
  params?: { page?: number; limit?: number },
) {
  return useQuery({
    queryKey: ["menu", "items", itemId, "stock", "history", params],
    queryFn: async () => {
      const response = await menuApi.getStockHistory(itemId, params);
      return response.data || [];
    },
    enabled: !!itemId,
    staleTime: 30000, // 30 seconds
  });
}

/**
 * useLowStockItems Hook
 *
 * Query to get items with low stock
 */
export function useLowStockItems() {
  return useQuery({
    queryKey: ["menu", "items", "low-stock"],
    queryFn: async () => {
      const response = await menuApi.getLowStockItems();
      return response.data || [];
    },
    staleTime: 30000, // 30 seconds
  });
}

/**
 * useOutOfStockItems Hook
 *
 * Query to get items that are out of stock
 */
export function useOutOfStockItems() {
  return useQuery({
    queryKey: ["menu", "items", "out-of-stock"],
    queryFn: async () => {
      const response = await menuApi.getOutOfStockItems();
      return response.data || [];
    },
    staleTime: 30000, // 30 seconds
  });
}

/**
 * useResetStock Hook
 *
 * Mutation to reset stock for multiple items (daily reset)
 * Resets stock to initialStock value for each tracked item
 */
export function useResetStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: {
      items: Array<{ menuItemId: number; quantity: number }>;
    }) => {
      const response = await menuApi.dailyStockReset(variables);
      return response;
    },
    onSuccess: () => {
      // Invalidate all item queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.menu.all,
      });
      // Invalidate stock-related queries
      queryClient.invalidateQueries({
        queryKey: ["menu", "items", "low-stock"],
      });
      queryClient.invalidateQueries({
        queryKey: ["menu", "items", "out-of-stock"],
      });
    },
  });
}

/**
 * useSetInventoryType Hook
 *
 * Mutation to change the inventory type of a menu item
 */
export function useSetInventoryType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      inventoryType,
      lowStockAlert,
    }: {
      id: number;
      inventoryType: string;
      lowStockAlert?: number;
    }) => {
      const response = await menuApi.setInventoryType(
        id,
        inventoryType,
        lowStockAlert,
      );
      return response;
    },
    onSuccess: (_, variables) => {
      // Invalidate specific item query
      queryClient.invalidateQueries({
        queryKey: queryKeys.menu.detail(variables.id),
      });
      // Invalidate all items list
      queryClient.invalidateQueries({
        queryKey: queryKeys.menu.all,
      });
      // Invalidate stock-related queries
      queryClient.invalidateQueries({
        queryKey: ["menu", "items", "low-stock"],
      });
      queryClient.invalidateQueries({
        queryKey: ["menu", "items", "out-of-stock"],
      });
    },
  });
}
