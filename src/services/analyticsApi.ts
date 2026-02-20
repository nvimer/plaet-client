import { axiosClient } from "./axiosClient";
import { DailyAnalytics } from "@/types/analytics";

/**
 * ANALYTICS API - Client
 * Serves dashboard data for sales and performance.
 */

export const getDailySummary = async (date: string): Promise<DailyAnalytics> => {
  const { data } = await axiosClient.get(`/analytics/daily-summary?date=${date}`);
  return data;
};

export const getTopProducts = async (limit: number = 5): Promise<any[]> => {
  const { data } = await axiosClient.get(`/analytics/top-products?limit=${limit}`);
  return data;
};
