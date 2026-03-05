import { useQuery } from "@tanstack/react-query";
import * as analyticsApi from "@/services/analyticsApi";

/**
 * HOOK: useAnalytics
 * Fetches dashboard statistics and performance data.
 */
export const useAnalytics = (date: string = new Date().toISOString().split("T")[0]) => {
  const dailySummaryQuery = useQuery({
    queryKey: ["analytics", "daily-summary", date],
    queryFn: () => analyticsApi.getDailySummary(date),
    staleTime: 1000 * 60 * 10,
  });

  return {
    dailySummary: dailySummaryQuery.data,
    topProducts: dailySummaryQuery.data?.topProducts || [],
    isLoading: dailySummaryQuery.isLoading,
    isError: dailySummaryQuery.isError,
    refetch: dailySummaryQuery.refetch
  };
};

export const useMenuEngineering = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ["analytics", "menu-engineering", startDate, endDate],
    queryFn: () => analyticsApi.getMenuEngineering(startDate, endDate),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useSalesPrediction = (targetDate: string) => {
  return useQuery({
    queryKey: ["analytics", "predictions", targetDate],
    queryFn: () => analyticsApi.getSalesPrediction(targetDate),
    staleTime: 1000 * 60 * 60,
  });
};

export const useHeatmap = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ["analytics", "heatmap", startDate, endDate],
    queryFn: () => analyticsApi.getHeatmap(startDate, endDate),
    staleTime: 1000 * 60 * 60,
  });
};
