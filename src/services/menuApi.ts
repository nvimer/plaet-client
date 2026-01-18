/**
 * MENU API SERVICE
 *
 * Services related with menu of restaurant
 * Base Endpoint: /menu/*
 */

import { axiosClient } from "./axiosClient";
import type {
  MenuCategory,
  MenuItem,
  CreateMenuCategoryInput,
  UpdateMenuCategoryInput,
  CreateMenuItemInput,
  UpdateMenuItemInput,
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
  StockHistoryEntry,
} from "@/types";

// ==================== CATEGORIES ====================

/**
 * GET /menu/categories
 *
 * Get list of all menu categories with pagination
 *
 * @param params - Params of pagination
 * @returns Paginated listed of Menu Categories
 */
export const getCategories = async (params?: PaginationParams) => {
  const { data } = await axiosClient.get<PaginatedResponse<MenuCategory>>(
    "/menu/categories",
    { params },
  );
  return data;
};

/**
 * GET /menu/categories/search
 *
 * Search a menu categories with filters
 *
 * @param params - Params of search and pagination
 * @returns Paginated filted listed of menu categories
 */
export const searchCategories = async (params: PaginationParams) => {
  const { data } = await axiosClient.get<
    ApiResponse<PaginatedResponse<MenuCategory>>
  >("/menu/categories/search", { params });
  return data;
};

/**
 * GET /menu/categories/:id
 *
 * Get menu category by ID
 *
 * @param id - Menu Category ID
 * @returns Menu Category selected with Data
 */
export const getCategoryById = async (id: number) => {
  const { data } = await axiosClient.get<ApiResponse<MenuCategory>>(
    `/menu/categories/${id}`,
  );
  return data;
};

/**
 * POST /menu/categories
 *
 * Create a new Category of Menu
 *
 * @param categoryData - Datos de la nueva categoría
 * @returns Categoría creada
 */
export const createCategory = async (categoryData: CreateMenuCategoryInput) => {
  const { data } = await axiosClient.post<ApiResponse<MenuCategory>>(
    "/menu/categories",
    categoryData,
  );
  return data;
};

/**
 * PATCH /menu/categories/:id
 *
 * Update a existing menu category
 *
 * @param id - ID de la categoría
 * @param categoryData - Datos a actualizar
 * @returns Categoría actualizada
 */
export const updateCategory = async (
  id: number,
  categoryData: UpdateMenuCategoryInput,
) => {
  const { data } = await axiosClient.patch<ApiResponse<MenuCategory>>(
    `/menu/categories/${id}`,
    categoryData,
  );
  return data;
};

/**
 * DELETE /menu/categories/:id
 *
 * Delete a menu category (request is soft delete)
 *
 * @param id - ID de la categoría
 */
export const deleteCategory = async (id: number) => {
  const { data } = await axiosClient.delete<ApiResponse<null>>(
    `/menu/categories/${id}`,
  );
  return data;
};

/**
 * DELETE /menu/categories/bulk
 *
 * Delete multiple categories
 *
 * @param ids - Menu Categories array of IDs to delete
 */
export const bulkDeleteCategories = async (ids: number[]) => {
  const { data } = await axiosClient.delete<
    ApiResponse<{ deletedCount: number }>
  >("/menu/categories/bulk", { data: { ids } });
  return data;
};

// ==================== ITEMS ====================

/**
 * GET /menu/items
 *
 * Get paginated listed of menu items
 *
 * @param params - Params of pagination
 * @returns Paginated list of menu items
 */
export const getMenuItems = async (params?: PaginationParams) => {
  const { data } = await axiosClient.get<PaginatedResponse<MenuItem>>(
    "/menu/items",
    { params },
  );
  return data;
};

/**
 * GET /menu/items/:id
 *
 * Get a menu item by ID
 *
 * @param id - Menu Item ID
 * @returns Data of Menu Item
 */
export const getMenuItemById = async (id: number) => {
  const { data } = await axiosClient.get<ApiResponse<MenuItem>>(
    `/menu/items/${id}`,
  );
  return data;
};

/**
 * POST /menu/items
 *
 * Create a new menu item
 *
 * @param itemData - New Menu Item Data
 * @returns create Menu Item
 */
export const createMenuItem = async (itemData: CreateMenuItemInput) => {
  const { data } = await axiosClient.post<ApiResponse<MenuItem>>(
    "/menu/items",
    itemData,
  );
  return data;
};

/**
 * PATCH /menu/items/:id
 *
 * Update a exiting Menu Item
 *
 * @param id - Menu Item ID
 * @param itemData - Data to update
 * @returns Updated Menu Item
 */
export const updateMenuItem = async (
  id: number,
  itemData: UpdateMenuItemInput,
) => {
  const { data } = await axiosClient.patch<ApiResponse<MenuItem>>(
    `/menu/items/${id}`,
    itemData,
  );
  return data;
};

/**
 * DELETE /menu/items/:id
 *
 * Delete a Menu Item
 *
 * @param id - Menu Item ID
 */
export const deleteMenuItem = async (id: number) => {
  const { data } = await axiosClient.delete<ApiResponse<null>>(
    `/menu/items/${id}`,
  );
  return data;
};

// ==================== STOCK MANAGEMENT ====================

/**
 * GET /menu/items/low-stock
 *
 * Get items with low stock
 *
 * @returns List of items with low stock
 */
export const getLowStockItems = async () => {
  const { data } = await axiosClient.get<ApiResponse<MenuItem[]>>(
    "/menu/items/low-stock",
  );
  return data;
};

/**
 * GET /menu/items/out-of-stock
 *
 * Get items without stock
 *
 * @returns List of items out of stock
 */
export const getOutOfStockItems = async () => {
  const { data } = await axiosClient.get<ApiResponse<MenuItem[]>>(
    "/menu/items/out-of-stock",
  );
  return data;
};

/**
 * POST /menu/items/:id/stock/add
 *
 * Add stock to a menu item
 *
 * @param id - Menu Item ID
 * @param stockData - Stock data (quantity, reason)
 * @returns Updated Menu Item
 */
export const addStock = async (
  id: number,
  stockData: { quantity: number; reason?: string },
) => {
  const { data } = await axiosClient.post<ApiResponse<MenuItem>>(
    `/menu/items/${id}/stock/add`,
    stockData,
  );
  return data;
};

/**
 * POST /menu/items/:id/stock/remove
 *
 * Remove stock from a menu item
 *
 * @param id - Menu Item ID
 * @param stockData - Stock data (quantity, reason)
 * @returns Updated Menu Item
 */
export const removeStock = async (
  id: number,
  stockData: { quantity: number; reason?: string },
) => {
  const { data } = await axiosClient.post<ApiResponse<MenuItem>>(
    `/menu/items/${id}/stock/remove`,
    stockData,
  );
  return data;
};

/**
 * GET /menu/items/:id/stock/history
 *
 * Get stock history for a menu item
 *
 * @param id - Menu Item ID
 * @param params - Pagination params
 * @returns Paginated stock history
 */
export const getStockHistory = async (
  id: number,
  params?: PaginationParams,
) => {
  const { data } = await axiosClient.get<PaginatedResponse<StockHistoryEntry>>(
    `/menu/items/${id}/stock/history`,
    { params },
  );
  return data;
};

/**
 * POST /menu/items/stock/daily-reset
 *
 * Reset daily stock for multiple items
 *
 * @param resetData - Daily stock reset data
 * @returns Response with reset results
 */
export const dailyStockReset = async (resetData: {
  items: Array<{ menuItemId: number; quantity: number }>;
}) => {
  const { data } = await axiosClient.post<ApiResponse<{ resetCount?: number }>>(
    "/menu/items/stock/daily-reset",
    resetData,
  );
  return data;
};

/**
 * PATCH /menu/items/:id/inventory-type
 *
 * Set inventory type for a menu item
 *
 * @param id - Menu Item ID
 * @param inventoryType - Inventory type (NONE, TRACKED, UNLIMITED)
 * @returns Updated Menu Item
 */
export const setInventoryType = async (
  id: number,
  inventoryType: string,
) => {
  const { data } = await axiosClient.patch<ApiResponse<MenuItem>>(
    `/menu/items/${id}/inventory-type`,
    { inventoryType },
  );
  return data;
};
