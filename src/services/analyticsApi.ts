import { axiosClient } from "./axiosClient";
import type { DailyAnalytics, TopProduct, ApiResponse } from "../types";

/**
 * ANALYTICS API - Client
 * Serves dashboard data for sales and performance.
 */

export interface DailySummaryResponse {
  salesSummary: {
    totalSold: number;
    orderCount: number;
    byPaymentMethod: Record<string, number>;
    byCategory: Array<{ name: string; total: number }>;
  };
  topProducts: Array<{
    id: number;
    name: string;
    quantity: number;
    totalRevenue: number;
  }>;
  totalExpenses: number;
  netBalance: number;
}

export const getDailySummary = async (date: string): Promise<DailySummaryResponse> => {
  const { data } = await axiosClient.get<ApiResponse<DailySummaryResponse>>("/analytics/daily-summary", {
    params: { date }
  });
  return data.data;
};


export const getTopProducts = async (limit: number = 5, date?: string): Promise<TopProduct[]> => {
  const { data } = await axiosClient.get<ApiResponse<TopProduct[]>>("/analytics/top-products", {
    params: { limit, date }
  });
  return data.data;
};
