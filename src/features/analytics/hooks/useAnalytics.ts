import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "@/services";

/**
 * HOOK: useAnalytics
 * Fetches dashboard statistics and performance data.
 */
export const useAnalytics = (date: string = new Date().toISOString().split("T")[0]) => {
  // Fetch daily sales and expenses summary
  const dailySummaryQuery = useQuery({
    queryKey: ["analytics", "daily-summary", date],
    queryFn: () => analyticsApi.getDailySummary(date),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  // Fetch top products ranking
  const topProductsQuery = useQuery({
    queryKey: ["analytics", "top-products"],
    queryFn: () => analyticsApi.getTopProducts(5),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  return {
    dailySummary: dailySummaryQuery.data,
    topProducts: topProductsQuery.data,
    isLoading: dailySummaryQuery.isLoading || topProductsQuery.isLoading,
    isError: dailySummaryQuery.isError || topProductsQuery.isError,
    refetch: () => {
      dailySummaryQuery.refetch();
      topProductsQuery.refetch();
    }
  };
};
