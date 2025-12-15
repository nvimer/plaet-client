import { CACHE_TIME, STALE_TIME } from "@/config/constants";
import { QueryClient } from "@tanstack/react-query";

/**
 * QueryClient configuration
 *
 * Manages server state caching and fetching.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // How long data is fresh
      staleTime: STALE_TIME,
      // How long unused data stays in cache
      gcTime: CACHE_TIME,
      // Retry failed request once
      retry: 1,
      // Don't refetch on window focus
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * Query Keys
 *
 * Centralized query Keys for cache management.
 *
 * @example
 * useQuery({ queryKey: queryKeys.tables.all })
 */
export const queryKeys = {
  // Tables
  tables: {
    // All tables
    all: ["tables"] as const,
    // Single table
    detail: (id: number) => ["tables", id] as const,
    // Filter by status
    byStatus: (status: string) => ["tables", { status }] as const,
  },

  // MenuCategories
  categories: {
    all: ["categories"] as const,
    detail: (id: number) => ["categories", id] as const,
  },

  // Menu Items
  menu: {
    all: ["menu"] as const,
    detail: (id: number) => ["menu", id] as const,
    byCategory: (categoryId: number) => ["menu", { categoryId }] as const,
    available: () => ["menu", { available: true }] as const,
  },

  // Orders
  orders: {
    all: ["orders"] as const,
    // Single order
    detail: (id: string) => ["orders", id] as const,
    byStatus: (status: string) => ["orders", { status }] as const,
    byType: (type: string) => ["orders", { type }] as const,
    byTable: (tableId: string) => ["orders", { tableId }] as const,
    // Today's orders
    today: () => ["orders", { today: true }] as const,
  },
};
