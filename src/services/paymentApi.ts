// PAYMENTS API SERVICE - Supabase Edge Functions

import { FUNCTIONS_BASE } from "@/lib/supabase";
import type { Payment, ApiResponse, PaginatedResponse, PaginationParams } from "@/types";
import { PaymentMethod } from "@/types";

const FUNCTION_HEADERS = {
  "Content-Type": "application/json",
  apikey: import.meta.env.VITE_DB_ANON_KEY,
};

async function authFetch(url: string, options: RequestInit = {}) {
  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: { ...FUNCTION_HEADERS, ...options.headers },
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw { response: { status: res.status, data } };
  }
  return data;
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
