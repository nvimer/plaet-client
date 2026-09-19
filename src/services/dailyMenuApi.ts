import { callFunction, query } from "./functionsClient";

/**
 * Menu Item Option - Simplified for daily menu display
 */
export interface MenuItemOption {
  id: number;
  name: string;
  price: number;
  categoryId: number;
  imageUrl?: string | null;
}

/**
 * Menu Category - For category references
 */
export interface MenuCategory {
  id: number;
  name: string;
  description: string | null;
  order: number;
}

/**
 * Daily Menu Configuration
 * Complete menu with item references and pricing
 */
export interface DailyMenu {
  id: string;
  isActive: boolean;
  basePrice: number; // Base margin added to protein individual price
  packagingFee: number; // Cost of containers (Portacomida)
  createdAt: string;
  updatedAt: string;

  // Categories
  soupCategory: MenuCategory | null;
  principleCategory: MenuCategory | null;
  proteinCategory: MenuCategory | null;
  drinkCategory: MenuCategory | null;
  extraCategory: MenuCategory | null;
  saladCategory: MenuCategory | null;
  riceCategory: MenuCategory | null;
  dessertCategory?: MenuCategory | null;

  // Item options for each category
  soupOptions: MenuItemOption[];
  principleOptions: MenuItemOption[];
  drinkOptions: MenuItemOption[];
  extraOptions: MenuItemOption[];
  saladOptions: MenuItemOption[];
  dessertOptions?: MenuItemOption[];
  riceOptions: MenuItemOption[]; // Changed from optional to mandatory to match response

  // All proteins available (not limited options)
  proteinOptions: MenuItemOption[];
}

/**
 * Input for item options configuration
 */
export interface ItemOptionInput {
  option1Id?: number | null;
  option2Id?: number | null;
  option3Id?: number | null;
}

/**
 * Input for updating daily menu configuration
 */
export interface UpdateDailyMenuData {
  // Prices - base margin added to protein individual price
  basePrice?: number;
  packagingFee?: number;

  // Category IDs
  soupCategoryId?: number | null;
  principleCategoryId?: number | null;
  proteinCategoryId?: number | null;
  drinkCategoryId?: number | null;
  extraCategoryId?: number | null;
  saladCategoryId?: number | null;
  riceCategoryId?: number | null;
  dessertCategoryId?: number | null;

  // Item options for each category
  soupOptions?: ItemOptionInput;
  principleOptions?: ItemOptionInput;
  drinkOptions?: ItemOptionInput;
  extraOptions?: ItemOptionInput;
  saladOptions?: ItemOptionInput;
  riceOptions?: ItemOptionInput;
  dessertOptions?: ItemOptionInput;

  // All protein IDs available (array of all protein item IDs)
  allProteinIds?: number[];
  createdAt?: string;
}

/**
 * API Response wrapper
 */
export interface DailyMenuResponse {
  success: boolean;
  message: string;
  data: DailyMenu | null;
}

export interface PaginatedDailyMenuResponse {
  success: boolean;
  data: DailyMenu[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Get history of daily menus
 */
export async function getHistory(page = 1, limit = 20) {
  return await callFunction<DailyMenu[]>(`daily-menu-history${query({ page, limit })}`) as unknown as PaginatedDailyMenuResponse;
}

/**
 * Get today's daily menu with full item details
 */
export async function getToday() {
  return await callFunction<DailyMenu | null>("daily-menu-get?date=current") as unknown as DailyMenuResponse;
}

/**
 * Get daily menu for a specific date
 */
export async function getByDate(date: string) {
  return await callFunction<DailyMenu | null>(`daily-menu-get${query({ date })}`) as unknown as DailyMenuResponse;
}

/**
 * Update or create today's daily menu
 */
export async function updateToday(data: UpdateDailyMenuData) {
  return await callFunction<DailyMenu>("daily-menu-upsert?date=today", {
    method: "POST",
    body: JSON.stringify(data),
  }) as unknown as DailyMenuResponse;
}

/**
 * Update daily menu for a specific date
 */
export async function updateByDate(date: string, data: UpdateDailyMenuData) {
  return await callFunction<DailyMenu>(`daily-menu-upsert${query({ date })}`, {
    method: "POST",
    body: JSON.stringify(data),
  }) as unknown as DailyMenuResponse;
}

/**
 * Get menu items by category ID
 */
export async function getItemsByCategory(categoryId: number) {
  return await callFunction<MenuItemOption[]>(`menu-items-list${query({ categoryId })}`);
}
