import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dailyMenuApi } from "@/services";

export interface DailyMenu {
  id: string;
  date: string;
  side: string;
  soup: string;
  drink: string;
  dessert: string | null;
  isActive: boolean;
}

export interface UpdateDailyMenuData {
  side: string;
  soup: string;
  drink: string;
  dessert?: string;
}

const DAILY_MENU_KEYS = {
  all: ["daily-menu"] as const,
  today: () => [...DAILY_MENU_KEYS.all, "today"] as const,
  byDate: (date: string) => [...DAILY_MENU_KEYS.all, date] as const,
};

export function useDailyMenuToday() {
  return useQuery({
    queryKey: DAILY_MENU_KEYS.today(),
    queryFn: async () => {
      const response = await dailyMenuApi.getToday();
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useDailyMenuByDate(date: string) {
  return useQuery({
    queryKey: DAILY_MENU_KEYS.byDate(date),
    queryFn: async () => {
      const response = await dailyMenuApi.getByDate(date);
      return response.data;
    },
    enabled: !!date,
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateDailyMenu() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateDailyMenuData) => {
      const response = await dailyMenuApi.updateToday(data);
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
      const response = await dailyMenuApi.updateByDate(date, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DAILY_MENU_KEYS.all });
    },
  });
}
