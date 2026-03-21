import { useQuery } from "@tanstack/react-query";
import { menuApi } from "@/services";

/**
 * useStockMovements Hook
 * 
 * Fetches daily stock movement statistics for the dashboard chart.
 */
export function useStockMovements(days: number = 7) {
  return useQuery({
    queryKey: ["stock-movements", days],
    queryFn: async () => {
      const response = await menuApi.getStockMovements(days);
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
