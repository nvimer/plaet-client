// CASH CLOSURE API SERVICE - Supabase Edge Functions

import { FUNCTIONS_BASE } from "@/lib/supabase";
import { getAuthHeaders } from "./authApi";
import type { CashClosure, ApiResponse, PaginatedResponse, PaginationParams } from "../types";

const FUNCTION_HEADERS = {
  "Content-Type": "application/json",
  apikey: import.meta.env.VITE_DB_ANON_KEY,
};

async function authFetch(url: string, options: RequestInit = {}) {
  const res = await fetch(url, {
    ...options,

    headers: { ...FUNCTION_HEADERS, ...getAuthHeaders(), ...options.headers },
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw { response: { status: res.status, data } };
  }
  return data;
}

export const getCashClosures = async (params?: PaginationParams & { status?: string }): Promise<PaginatedResponse<CashClosure>> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.set("page", String(params.page));
  if (params?.limit) queryParams.set("limit", String(params.limit));
  if (params?.status) queryParams.set("status", params.status);

  const data = await authFetch(`${FUNCTIONS_BASE}/cash-closures-list?${queryParams}`);
  return {
    success: true,
    message: data.message,
    data: data.data,
    meta: data.meta,
  };
};

export const getCashClosureById = async (id: string): Promise<ApiResponse<CashClosure>> => {
  const data = await authFetch(`${FUNCTIONS_BASE}/cash-closures-get/${id}`);
  return {
    success: true,
    message: data.message,
    data: data.data,
  };
};

export const getCurrentShift = async (): Promise<CashClosure | null> => {
  const data = await authFetch(`${FUNCTIONS_BASE}/cash-closures-list?status=OPEN&limit=1`);
  return data.data?.[0] || null;
};

export const openShift = async (dto: { openingBalance: number }): Promise<CashClosure> => {
  const data = await authFetch(`${FUNCTIONS_BASE}/cash-closures-open`, {
    method: "POST",
    body: JSON.stringify(dto),
  });
  return data.data;
};

export const closeShift = async (dto: { actualBalance: number }): Promise<CashClosure> => {
  const data = await authFetch(`${FUNCTIONS_BASE}/cash-closures-close`, {
    method: "POST",
    body: JSON.stringify(dto),
  });
  return data.data;
};

export interface CashShiftSummary {
  openingBalance: number;
  cashSales: number;
  nequiSales: number;
  totalExpenses: number;
  totalVouchers?: number;
  expectedBalance: number;
  actualBalance?: number;
  difference?: number;
}

export const getShiftSummary = async (closureId: string): Promise<CashShiftSummary> => {
  const data = await authFetch(`${FUNCTIONS_BASE}/cash-closures-get/${closureId}`);
  const closure = data.data;
  return {
    openingBalance: closure.opening_balance || 0,
    cashSales: closure.total_cash || 0,
    nequiSales: closure.total_nequi || 0,
    totalExpenses: closure.total_expenses || 0,
    totalVouchers: closure.total_vouchers || 0,
    expectedBalance: closure.expected_balance || 0,
    actualBalance: closure.actual_balance,
    difference: closure.difference,
  };
};

export const cashClosureApi = {
  getCashClosures,
  getCashClosureById,
  getCurrentShift,
  openShift,
  closeShift,
  getShiftSummary,
};
