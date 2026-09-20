// MENU API SERVICE - Supabase Edge Functions

import { FUNCTIONS_BASE } from "@/lib/supabase";
import { fetchFunction } from "./functionsClient";
import type {
  MenuCategory,
  CreateMenuCategoryInput,
  UpdateMenuCategoryInput,
  MenuItem,
  StockHistoryEntry,
  CreateMenuItemInput,
  UpdateMenuItemInput,
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
} from "@/types";

/**
 * Same path as the other services: adds the token and refreshes once on a 401.
 * Each caller knows the shape of its own endpoint, as it did when this was a
 * bare res.json().
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function authFetch(url: string, options: RequestInit = {}): Promise<any> {
  return await fetchFunction(url, options);
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
  const data = await authFetch(`${FUNCTIONS_BASE}/menu-categories-get?id=${id}`);
  return {
    success: true,
    message: data.message,
    data: data.data,
  };
};

// ==================== MENU ITEMS ====================

export const createCategory = async (categoryData: CreateMenuCategoryInput): Promise<ApiResponse<MenuCategory>> => {
  const data = await authFetch(`${FUNCTIONS_BASE}/menu-categories-create`, {
    method: "POST",
    body: JSON.stringify(categoryData),
  });
  return {
    success: true,
    message: data.message,
    data: data.data,
  };
};

export const updateCategory = async (
  id: number,
  categoryData: UpdateMenuCategoryInput,
): Promise<ApiResponse<MenuCategory>> => {
  const data = await authFetch(`${FUNCTIONS_BASE}/menu-categories-update?id=${id}`, {
    method: "PATCH",
    body: JSON.stringify(categoryData),
  });
  return {
    success: true,
    message: data.message,
    data: data.data,
  };
};

export const deleteCategory = async (id: number): Promise<ApiResponse<null>> => {
  const data = await authFetch(`${FUNCTIONS_BASE}/menu-categories-delete?id=${id}`, {
    method: "DELETE",
  });
  return {
    success: true,
    message: data.message,
    data: null,
  };
};

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

// ==================== INVENTORY ====================

/** Stock at or under the alert threshold, still sellable. */
export const getLowStockItems = async (): Promise<ApiResponse<MenuItem[]>> => {
  const data = await authFetch(`${FUNCTIONS_BASE}/menu-items-list?stockStatus=low&limit=100`);
  return { success: true, message: data.message, data: data.data };
};

/** Tracked items with nothing left. */
export const getOutOfStockItems = async (): Promise<ApiResponse<MenuItem[]>> => {
  const data = await authFetch(`${FUNCTIONS_BASE}/menu-items-list?stockStatus=out&limit=100`);
  return { success: true, message: data.message, data: data.data };
};

export const getLowStock = getLowStockItems;
export const getOutOfStock = getOutOfStockItems;

export const addStock = async (
  id: number,
  stockData: { quantity: number; reason?: string },
): Promise<ApiResponse<MenuItem>> => {
  const data = await authFetch(`${FUNCTIONS_BASE}/menu-items-stock-adjust?id=${id}&action=add`, {
    method: "POST",
    body: JSON.stringify(stockData),
  });
  return { success: true, message: data.message, data: data.data };
};

export const removeStock = async (
  id: number,
  stockData: { quantity: number; reason?: string },
): Promise<ApiResponse<MenuItem>> => {
  const data = await authFetch(`${FUNCTIONS_BASE}/menu-items-stock-adjust?id=${id}&action=remove`, {
    method: "POST",
    body: JSON.stringify(stockData),
  });
  return { success: true, message: data.message, data: data.data };
};

/** Movements of one item. */
export const getStockHistory = async (
  itemId: number,
  params?: PaginationParams,
): Promise<PaginatedResponse<StockHistoryEntry>> => {
  const query = new URLSearchParams({ itemId: String(itemId) });
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));

  const data = await authFetch(`${FUNCTIONS_BASE}/menu-items-stock-history?${query}`);
  return { success: true, message: data.message, data: data.data, meta: data.meta };
};

/** Movements across the whole restaurant. */
export const getAllStockHistory = async (
  params?: PaginationParams,
): Promise<PaginatedResponse<StockHistoryEntry>> => {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));

  const data = await authFetch(`${FUNCTIONS_BASE}/menu-items-stock-history?${query}`);
  return { success: true, message: data.message, data: data.data, meta: data.meta };
};

/** The morning load: sets each item to the portions cooked for the day. */
export const dailyStockReset = async (variables: {
  items: Array<{ itemId: number; quantity: number }>;
}): Promise<ApiResponse<{ updated: number }>> => {
  const data = await authFetch(`${FUNCTIONS_BASE}/menu-items-stock-reset`, {
    method: "POST",
    body: JSON.stringify(variables),
  });
  return { success: true, message: data.message, data: data.data };
};

export const dailyStockResetByCategory = async (variables: {
  categoryId: number;
  items: Array<{ itemId: number; quantity: number }>;
}): Promise<ApiResponse<{ updated: number }>> => {
  const data = await authFetch(`${FUNCTIONS_BASE}/menu-items-stock-reset`, {
    method: "POST",
    body: JSON.stringify(variables),
  });
  return { success: true, message: data.message, data: data.data };
};

export const setInventoryType = async (
  id: number,
  inventoryType: string,
  lowStockAlert?: number,
  stockQuantity?: number,
): Promise<ApiResponse<MenuItem>> => {
  const data = await authFetch(`${FUNCTIONS_BASE}/menu-items-inventory-type?id=${id}`, {
    method: "PATCH",
    body: JSON.stringify({ inventoryType, lowStockAlert, stockQuantity }),
  });
  return { success: true, message: data.message, data: data.data };
};

/** Daily movement totals for the dashboard chart. */
export const getStockMovements = async (days: number = 7) => {
  const data = await authFetch(`${FUNCTIONS_BASE}/menu-items-stock-movements?days=${days}`);
  return { success: true, message: data.message, data: data.data };
};

// ==================== EXPORTS ===================

export const menuApi = {
  getCategories,
  searchCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
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
  getLowStockItems,
  getOutOfStockItems,
  addStock,
  removeStock,
  getStockHistory,
  getAllStockHistory,
  dailyStockReset,
  dailyStockResetByCategory,
  setInventoryType,
  getStockMovements,
};
