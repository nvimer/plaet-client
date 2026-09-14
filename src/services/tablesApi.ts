// TABLES API SERVICE - Supabase Edge Functions

import { FUNCTIONS_BASE } from "@/lib/supabase";
import { getAuthHeaders } from "./authApi";
import type {
  Table,
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
} from "@/types";

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

export interface TablesFilterParams extends PaginationParams {
  status?: string;
}

export const getTables = async (params?: TablesFilterParams): Promise<PaginatedResponse<Table>> => {
  const queryParams = new URLSearchParams();
  if (params?.status) queryParams.set("status", params.status);

  const data = await authFetch(`${FUNCTIONS_BASE}/tables-list?${queryParams}`);
  return {
    success: true,
    message: data.message,
    data: data.data,
    meta: data.meta,
  };
};

export const getTableById = async (id: number): Promise<ApiResponse<Table>> => {
  const data = await authFetch(`${FUNCTIONS_BASE}/tables-list`);
  const table = data.data.find((t: Table) => t.id === id);
  if (!table) throw { response: { status: 404, data: { message: "Table not found" } } };
  return {
    success: true,
    message: "Table fetched successfully",
    data: table,
  };
};

export const updateTableStatus = async (
  id: number,
  statusData: { status: string },
): Promise<ApiResponse<Table>> => {
  const data = await authFetch(`${FUNCTIONS_BASE}/tables-update/${id}`, {
    method: "PATCH",
    body: JSON.stringify(statusData),
  });
  return {
    success: true,
    message: data.message,
    data: data.data,
  };
};

export const updateTable = async (
  id: number,
  tableData: { location?: string; status?: string },
): Promise<ApiResponse<Table>> => {
  const data = await authFetch(`${FUNCTIONS_BASE}/tables-update/${id}`, {
    method: "PATCH",
    body: JSON.stringify(tableData),
  });
  return {
    success: true,
    message: data.message,
    data: data.data,
  };
};

export const getAvailableTables = async (): Promise<PaginatedResponse<Table>> => {
  const data = await authFetch(`${FUNCTIONS_BASE}/tables-list?status=AVAILABLE`);
  return {
    success: true,
    message: data.message,
    data: data.data,
    meta: data.meta,
  };
};

export const tablesApi = {
  getTables,
  getTableById,
  updateTableStatus,
  updateTable,
  getAvailableTables,
};
