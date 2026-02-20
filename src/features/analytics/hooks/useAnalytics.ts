import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "@/services";

/**
 * HOOK: useAnalytics
 * Fetches dashboard statistics and performance data.
 */
export const useAnalytics = (date: string = new Date().toISOString().split("T")[0]) => {
  // Fetch daily sales, expenses and top products summary in a single call
  const dailySummaryQuery = useQuery({
    queryKey: ["analytics", "daily-summary", date],
    queryFn: () => analyticsApi.getDailySummary(date),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  return {
    dailySummary: dailySummaryQuery.data,
    topProducts: dailySummaryQuery.data?.topProducts || [],
    isLoading: dailySummaryQuery.isLoading,
    isError: dailySummaryQuery.isError,
    refetch: dailySummaryQuery.refetch
  };
};
