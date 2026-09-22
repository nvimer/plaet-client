// TABLES API SERVICE - Supabase Edge Functions

import { FUNCTIONS_BASE } from "@/lib/supabase";
import { fetchFunction } from "./functionsClient";
import type {
  Table,
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
} from "@/types";

// Goes through the shared layer so an expired token is refreshed once and replayed.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function authFetch(url: string, options: RequestInit = {}): Promise<any> {
  return await fetchFunction(url, options);
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
  const data = await authFetch(`${FUNCTIONS_BASE}/tables-update`, {
    method: "PATCH",
    body: JSON.stringify({ id, ...statusData }),
  });
  return {
    success: true,
    message: data.message,
    data: data.data,
  };
};

export const updateTable = async (
  id: number,
  tableData: { number?: string | number; location?: string; status?: string },
): Promise<ApiResponse<Table>> => {
  const data = await authFetch(`${FUNCTIONS_BASE}/tables-update`, {
    method: "PATCH",
    body: JSON.stringify({ id, ...tableData }),
  });
  return {
    success: true,
    message: data.message,
    data: data.data,
  };
};

export const createTable = async (
  tableData: { number: string | number; location?: string; status?: string },
): Promise<ApiResponse<Table>> => {
  const data = await authFetch(`${FUNCTIONS_BASE}/tables-create`, {
    method: "POST",
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
  createTable,
  updateTableStatus,
  updateTable,
  getAvailableTables,
};
