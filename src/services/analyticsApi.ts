import { axiosClient } from "./axiosClient";
import type { DailyAnalytics, TopProduct } from "../types";

/**
 * ANALYTICS API - Client
 * Serves dashboard data for sales and performance.
 */

export const getDailySummary = async (date: string): Promise<DailyAnalytics> => {
  const { data } = await axiosClient.get(`/analytics/daily-summary?date=${date}`);
  return data;
};

export const getTopProducts = async (limit: number = 5, date?: string): Promise<TopProduct[]> => {
  const { data } = await axiosClient.get("/analytics/top-products", {
    params: { limit, date }
  });
  return data;
};
