import axiosClient from "./axiosClient";

/**
 * Menu Item Option - Simplified for daily menu display
 */
export interface MenuItemOption {
  id: number;
  name: string;
  price: number;
  categoryId: number;
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
  date: string;
  isActive: boolean;
  basePrice: number;
  premiumProteinPrice: number;
  createdAt: string;
  updatedAt: string;

  // Categories
  soupCategory: MenuCategory | null;
  principleCategory: MenuCategory | null;
  proteinCategory: MenuCategory | null;
  drinkCategory: MenuCategory | null;
  extraCategory: MenuCategory | null;
  saladCategory: MenuCategory | null;
  dessertCategory?: MenuCategory | null;

  // Item options for each category
  soupOptions: MenuItemOption[];
  principleOptions: MenuItemOption[];
  drinkOptions: MenuItemOption[];
  extraOptions: MenuItemOption[];
  saladOptions: MenuItemOption[];
  dessertOptions?: MenuItemOption[];

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
  // Prices
  basePrice?: number;
  premiumProteinPrice?: number;

  // Category IDs
  soupCategoryId?: number | null;
  principleCategoryId?: number | null;
  proteinCategoryId?: number | null;
  drinkCategoryId?: number | null;
  extraCategoryId?: number | null;
  saladCategoryId?: number | null;
  dessertCategoryId?: number | null;

  // Item options for each category
  soupOptions?: ItemOptionInput;
  principleOptions?: ItemOptionInput;
  drinkOptions?: ItemOptionInput;
  extraOptions?: ItemOptionInput;
  saladOptions?: ItemOptionInput;
  dessertOptions?: ItemOptionInput;

  // All protein IDs available (array of all protein item IDs)
  allProteinIds?: number[];
}

/**
 * API Response wrapper
 */
export interface DailyMenuResponse {
  success: boolean;
  message: string;
  data: DailyMenu | null;
}

const DAILY_MENU_BASE_URL = "/daily-menu";

/**
 * Get today's daily menu with full item details
 */
export async function getToday() {
  const response = await axiosClient.get<DailyMenuResponse>(`${DAILY_MENU_BASE_URL}/current`);
  return response.data;
}

/**
 * Get daily menu for a specific date
 */
export async function getByDate(date: string) {
  const response = await axiosClient.get<DailyMenuResponse>(`${DAILY_MENU_BASE_URL}/${date}`);
  return response.data;
}

/**
 * Update or create today's daily menu
 */
export async function updateToday(data: UpdateDailyMenuData) {
  const response = await axiosClient.put<DailyMenuResponse>(DAILY_MENU_BASE_URL, data);
  return response.data;
}

/**
 * Update daily menu for a specific date
 */
export async function updateByDate(date: string, data: UpdateDailyMenuData) {
  const response = await axiosClient.put<DailyMenuResponse>(`${DAILY_MENU_BASE_URL}/${date}`, data);
  return response.data;
}

/**
 * Get menu items by category ID
 */
export async function getItemsByCategory(categoryId: number) {
  const response = await axiosClient.get<{
    success: boolean;
    message: string;
    data: MenuItemOption[];
  }>(`/menu/items/by-category/${categoryId}`);
  return response.data;
}
