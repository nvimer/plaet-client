import { PaymentMethod } from "./enums";

export interface SalesSummary {
  totalSales: number;
  orderCount: number;
  byPaymentMethod: {
    method: PaymentMethod;
    amount: number;
    count: number;
  }[];
}

export interface TopProduct {
  id: string;
  name: string;
  quantity: number;
  totalRevenue: number;
}

export interface DailyAnalytics {
  salesSummary?: SalesSummary;
  topProducts?: TopProduct[];
  netBalance: number;
}
