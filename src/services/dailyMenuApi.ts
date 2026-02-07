import axiosClient from "./axiosClient";

export interface DailyMenu {
  id: string;
  date: string;
  side: string;
  soup: string;
  drink: string;
  dessert: string | null;
  isActive: boolean;
}

export interface DailyMenuResponse {
  success: boolean;
  message: string;
  data: DailyMenu | null;
}

export interface UpdateDailyMenuData {
  side: string;
  soup: string;
  drink: string;
  dessert?: string;
}

const DAILY_MENU_BASE_URL = "/daily-menu";

export const dailyMenuApi = {
  getToday: async () => {
    const response = await axiosClient.get<DailyMenuResponse>(`${DAILY_MENU_BASE_URL}/current`);
    return response.data;
  },

  getByDate: async (date: string) => {
    const response = await axiosClient.get<DailyMenuResponse>(`${DAILY_MENU_BASE_URL}/${date}`);
    return response.data;
  },

  updateToday: async (data: UpdateDailyMenuData) => {
    const response = await axiosClient.put<DailyMenuResponse>(DAILY_MENU_BASE_URL, data);
    return response.data;
  },

  updateByDate: async (date: string, data: UpdateDailyMenuData) => {
    const response = await axiosClient.put<DailyMenuResponse>(`${DAILY_MENU_BASE_URL}/${date}`, data);
    return response.data;
  },
};
