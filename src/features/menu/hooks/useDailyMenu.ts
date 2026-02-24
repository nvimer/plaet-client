import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getToday,
  getByDate,
  updateToday,
  updateByDate,
  getItemsByCategory,
  type DailyMenu,
  type UpdateDailyMenuData,
  type MenuItemOption,
} from "@/services/dailyMenuApi";

export type { DailyMenu, UpdateDailyMenuData, MenuItemOption };

const DAILY_MENU_KEYS = {
  all: ["daily-menu"] as const,
  today: () => [...DAILY_MENU_KEYS.all, "today"] as const,
  byDate: (date: string) => [...DAILY_MENU_KEYS.all, date] as const,
};

const CATEGORY_ITEMS_KEYS = {
  all: ["category-items"] as const,
  byCategory: (categoryId: number) => [...CATEGORY_ITEMS_KEYS.all, categoryId] as const,
};

export function useDailyMenuToday() {
  return useQuery({
    queryKey: DAILY_MENU_KEYS.today(),
    queryFn: async () => {
      try {
        const response = await getToday();
        return response.data;
      } catch (error: any) {
        if (error.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: (failureCount, error: any) => {
      if (error.response?.status === 404) return false;
      return failureCount < 1;
    },
  });
}

export function useDailyMenuByDate(date: string) {
  return useQuery({
    queryKey: DAILY_MENU_KEYS.byDate(date),
    queryFn: async () => {
      try {
        const response = await getByDate(date);
        return response.data;
      } catch (error: any) {
        if (error.response?.status === 404) {
          return null; // Return null if the menu is just not found, so we can create it
        }
        throw error;
      }
    },
    enabled: !!date,
    staleTime: 1000 * 60 * 5,
    retry: (failureCount, error: any) => {
      // Don't retry on 404s
      if (error.response?.status === 404) return false;
      return failureCount < 1;
    },
  });
}

export function useUpdateDailyMenu() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateDailyMenuData) => {
      const response = await updateToday(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DAILY_MENU_KEYS.all });
    },
  });
}

export function useUpdateDailyMenuByDate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ date, data }: { date: string; data: UpdateDailyMenuData }) => {
      const response = await updateByDate(date, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DAILY_MENU_KEYS.all });
    },
  });
}

/**
 * Hook to get menu items by category
 */
export function useItemsByCategory(categoryId: number) {
  return useQuery({
    queryKey: CATEGORY_ITEMS_KEYS.byCategory(categoryId),
    queryFn: async () => {
      const response = await getItemsByCategory(categoryId);
      return response.data || [];
    },
    enabled: !!categoryId,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook to get all items for daily menu configuration
 * Returns items for all configured categories
 */
export function useDailyMenuItems(menu: DailyMenu | null | undefined) {
  const soupItems = useItemsByCategory(menu?.soupCategory?.id || 0);
  const principleItems = useItemsByCategory(menu?.principleCategory?.id || 0);
  const proteinItems = useItemsByCategory(menu?.proteinCategory?.id || 0);
  const drinkItems = useItemsByCategory(menu?.drinkCategory?.id || 0);
  const extraItems = useItemsByCategory(menu?.extraCategory?.id || 0);

  return {
    soupItems: soupItems.data || [],
    principleItems: principleItems.data || [],
    proteinItems: proteinItems.data || [],
    drinkItems: drinkItems.data || [],
    extraItems: extraItems.data || [],
    isLoading: soupItems.isLoading || principleItems.isLoading || proteinItems.isLoading || drinkItems.isLoading || extraItems.isLoading,
    error: soupItems.error || principleItems.error || proteinItems.error || drinkItems.error || extraItems.error,
  };
}
