// MENU API SERVICE - Supabase Edge Functions

import { FUNCTIONS_BASE } from "@/lib/supabase";
import type {
  MenuCategory,
  MenuItem,
  CreateMenuItemInput,
  UpdateMenuItemInput,
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
    credentials: "include",
    headers: { ...FUNCTION_HEADERS, ...options.headers },
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw { response: { status: res.status, data } };
  }
  return data;
}

// ==================== CATEGORIES ====================

export const getCategories = async (params?: PaginationParams): Promise<PaginatedResponse<MenuCategory>> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.set("page", String(params.page));
  if (params?.limit) queryParams.set("limit", String(params.limit));

  const data = await authFetch(`${FUNCTIONS_BASE}/menu-categories-list?${queryParams}`);
  return {
    success: true,
    message: data.message,
    data: data.data,
    meta: data.meta,
  };
};

export const searchCategories = async (params: PaginationParams): Promise<PaginatedResponse<MenuCategory>> => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.set("page", String(params.page));
  if (params.limit) queryParams.set("limit", String(params.limit));

  const data = await authFetch(`${FUNCTIONS_BASE}/menu-categories-list?${queryParams}`);
  return {
    success: true,
    message: data.message,
    data: data.data,
    meta: data.meta,
  };
};

export const getCategoryById = async (id: number): Promise<ApiResponse<MenuCategory>> => {
  const data = await authFetch(`${FUNCTIONS_BASE}/menu-categories-get/${id}`);
  return {
    success: true,
    message: data.message,
    data: data.data,
  };
};

// ==================== MENU ITEMS ====================

export const getMenuItems = async (params?: PaginationParams): Promise<PaginatedResponse<MenuItem>> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.set("page", String(params.page));
  if (params?.limit) queryParams.set("limit", String(params.limit));

  const data = await authFetch(`${FUNCTIONS_BASE}/menu-items-list?${queryParams}`);
  return {
    success: true,
    message: data.message,
    data: data.data,
    meta: data.meta,
  };
};

export const searchMenuItems = async (params: PaginationParams & { search?: string }): Promise<PaginatedResponse<MenuItem>> => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.set("page", String(params.page));
  if (params.limit) queryParams.set("limit", String(params.limit));
  if (params.search) queryParams.set("search", params.search);

  const data = await authFetch(`${FUNCTIONS_BASE}/menu-items-list?${queryParams}`);
  return {
    success: true,
    message: data.message,
    data: data.data,
    meta: data.meta,
  };
};

export const getMenuItemById = async (id: number): Promise<ApiResponse<MenuItem>> => {
  const data = await authFetch(`${FUNCTIONS_BASE}/menu-items-get/${id}`);
  return {
    success: true,
    message: data.message,
    data: data.data,
  };
};

export const getItemsByCategory = async (categoryId: number): Promise<PaginatedResponse<MenuItem>> => {
  const data = await authFetch(`${FUNCTIONS_BASE}/menu-items-list?categoryId=${categoryId}`);
  return {
    success: true,
    message: data.message,
    data: data.data,
    meta: data.meta,
  };
};

export const createMenuItem = async (itemData: CreateMenuItemInput): Promise<ApiResponse<MenuItem>> => {
  const data = await authFetch(`${FUNCTIONS_BASE}/menu-items-create`, {
    method: "POST",
    body: JSON.stringify(itemData),
  });
  return {
    success: true,
    message: data.message,
    data: data.data,
  };
};

export const updateMenuItem = async (
  id: number,
  itemData: UpdateMenuItemInput,
): Promise<ApiResponse<MenuItem>> => {
  const data = await authFetch(`${FUNCTIONS_BASE}/menu-items-update/${id}`, {
    method: "PATCH",
    body: JSON.stringify(itemData),
  });
  return {
    success: true,
    message: data.message,
    data: data.data,
  };
};

export const deleteMenuItem = async (id: number): Promise<ApiResponse<null>> => {
  const data = await authFetch(`${FUNCTIONS_BASE}/menu-items-delete/${id}`, {
    method: "DELETE",
  });
  return {
    success: true,
    message: data.message,
    data: null,
  };
};

// ==================== STUBS ===================

export const getSetLunchItems = async (params?: PaginationParams): Promise<PaginatedResponse<MenuItem>> => {
  return getMenuItems(params);
};

export const getLowStock = async () => {
  const data = await authFetch(`${FUNCTIONS_BASE}/menu-items-list?isAvailable=false`);
  return { success: true, data: data.data };
};

export const getOutOfStock = async () => {
  const data = await authFetch(`${FUNCTIONS_BASE}/menu-items-list`);
  const outOfStock = data.data.filter((item: MenuItem & { stock_quantity?: number }) => item.stock_quantity === 0);
  return { success: true, data: outOfStock };
};

// ==================== EXPORTS ===================

export const menuApi = {
  getCategories,
  searchCategories,
  getCategoryById,
  getMenuItems,
  searchMenuItems,
  getMenuItemById,
  getItemsByCategory,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getSetLunchItems,
  getLowStock,
  getOutOfStock,
};
