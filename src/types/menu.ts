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
  price: string;
  isAvailable?: boolean;
  isExtra?: boolean;
  imageUrl?: string;
  inventoryType?: string;
  stockQuantity?: number;
  initialStock?: number;
  lowStockAlert?: number;
  autoMarkUnavailable?: boolean;
}

export interface UpdateMenuItemInput {
  categoryId?: number;
  name?: string;
  description?: string;
  price?: string;
  isAvailable?: boolean;
  isExtra?: boolean;
  imageUrl?: string;
  inventoryType?: string;
  stockQuantity?: number;
  initialStock?: number;
  lowStockAlert?: number;
  autoMarkUnavailable?: boolean;
}
