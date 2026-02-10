export interface MenuCategory {
  id: number;
  name: string;
  description?: string;
  order: number;
  items?: MenuItem[];
  deleted: boolean;
  deletedAt?: string;
}

export interface CreateMenuCategoryInput {
  name: string;
  description?: string;
  order: number;
}

export interface UpdateMenuCategoryInput {
  name?: string;
  description?: string;
  order?: number;
}

export interface MenuItem {
  id: number;
  categoryId: number;
  name: string;
  description?: string;
  price: string;
  isExtra: boolean;
  isAvailable: boolean;
  imageUrl?: string;
  inventoryType: string;
  stockQuantity?: number;
  initialStock?: number;
  lowStockAlert?: number;
  autoMarkUnavailable: boolean;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
  deletedAt?: string;
}

export interface CreateMenuItemInput {
  categoryId: number;
  name: string;
  description?: string;
  price: string | number;
  isAvailable?: boolean;
  imageUrl?: string;
  inventoryType?: string;
  stockQuantity?: number;
  lowStockAlert?: number;
  autoMarkUnavailable?: boolean;
}

export interface UpdateMenuItemInput {
  categoryId?: number;
  name?: string;
  description?: string;
  price?: string;
  isAvailable?: boolean;
  imageUrl?: string;
  inventoryType?: string;
  stockQuantity?: number;
  lowStockAlert?: number;
  autoMarkUnavailable?: boolean;
}

/**
 * Stock Management Types
 */

/**
 * Add stock input
 */
export interface AddStockInput {
  quantity: number;
  reason?: string;
}

/**
 * Remove stock input
 */
export interface RemoveStockInput {
  quantity: number;
  reason?: string;
}

/**
 * Stock history entry
 */
export interface StockHistoryEntry {
  id: number;
  menuItemId: number;
  quantity: number;
  type: "ADD" | "REMOVE" | "RESET" | "ORDER" | "ADJUSTMENT";
  reason?: string;
  createdAt: string;
  createdBy?: string;
}

/**
 * Daily stock reset input
 */
export interface DailyStockResetInput {
  items: Array<{
    menuItemId: number;
    quantity: number;
  }>;
}

/**
 * Inventory type change input
 */
export interface InventoryTypeInput {
  inventoryType: string;
  lowStockAlert?: number;
}

/**
 * Inventory type enum
 * Synced with server enum - DO NOT ADD VALUES WITHOUT SERVER UPDATE
 */
export enum InventoryType {
  TRACKED = "TRACKED",
  UNLIMITED = "UNLIMITED",
}
