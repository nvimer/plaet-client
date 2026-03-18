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
  image?: File;
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
  image?: File;
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
  id: string;
  menuItemId: number;
  previousStock: number;
  newStock: number;
  quantity: number;
  adjustmentType: "MANUAL_ADD" | "MANUAL_REMOVE" | "DAILY_RESET" | "ORDER_DEDUCT" | "ORDER_CANCELLED";
  reason?: string;
  userId?: string;
  orderId?: string;
  createdAt: string;
  menuItem?: MenuItem;
}

/**
 * Daily stock reset input
 */
export interface DailyStockResetInput {
  items: Array<{
    itemId: number;
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
