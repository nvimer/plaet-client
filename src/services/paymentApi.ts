// PAYMENTS API SERVICE - Supabase Edge Functions

import { FUNCTIONS_BASE } from "@/lib/supabase";
import { fetchFunction } from "./functionsClient";
import type { Payment, ApiResponse, PaginatedResponse, PaginationParams } from "@/types";
import { PaymentMethod } from "@/types";

// Goes through the shared layer so an expired token is refreshed once and replayed.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function authFetch(url: string, options: RequestInit = {}): Promise<any> {
  return await fetchFunction(url, options);
}

export interface CreatePaymentData {
  method: PaymentMethod;
  amount: number;
  transactionRef?: string;
  ticketBookCodeId?: string;
  cashClosureId?: string;
}

export const getPayments = async (params?: PaginationParams & { orderId?: string; cashClosureId?: string }): Promise<PaginatedResponse<Payment>> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.set("page", String(params.page));
  if (params?.limit) queryParams.set("limit", String(params.limit));
  if (params?.orderId) queryParams.set("orderId", params.orderId);
  if (params?.cashClosureId) queryParams.set("cashClosureId", params.cashClosureId);

  const data = await authFetch(`${FUNCTIONS_BASE}/payments-list?${queryParams}`);
  return {
    success: true,
    message: data.message,
    data: data.data,
    meta: data.meta,
  };
};

export const createPayment = async (orderId: string, paymentData: CreatePaymentData): Promise<ApiResponse<Payment>> => {
  const data = await authFetch(`${FUNCTIONS_BASE}/payments-create`, {
    method: "POST",
    body: JSON.stringify({
      orderId,
      ...paymentData,
    }),
  });
  return {
    success: true,
    message: data.message,
    data: data.data,
  };
};

export const getPaymentsByOrder = async (orderId: string): Promise<PaginatedResponse<Payment>> => {
  return getPayments({ orderId });
};

export const getPaymentsByCashClosure = async (cashClosureId: string): Promise<PaginatedResponse<Payment>> => {
  return getPayments({ cashClosureId });
};

export const paymentApi = {
  getPayments,
  createPayment,
  getPaymentsByOrder,
  getPaymentsByCashClosure,
};
