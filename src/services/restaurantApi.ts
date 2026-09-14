/**
 * RESTAURANTS API SERVICE
 *
 * Services related to restaurant management (SuperAdmin only)
 * Uses Supabase Edge Functions
 */

import { FUNCTIONS_BASE, getStoredToken } from "@/lib/supabase";
import type {
  Restaurant,
  CreateRestaurantInput,
  UpdateRestaurantInput,
  RestaurantSearchParams,
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
} from "@/types";

function getAuthHeaders(): Record<string, string> {
  const token = getStoredToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
}

export const getRestaurants = async (params?: PaginationParams) => {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 20;

  const res = await fetch(
    `${FUNCTIONS_BASE}/restaurants-list?page=${page}&limit=${limit}`,
    { headers: getAuthHeaders() }
  );
  return handleResponse<PaginatedResponse<Restaurant>>(res);
};

export const searchRestaurants = async (params: PaginationParams & RestaurantSearchParams) => {
  const { page = 1, limit = 20, search, status } = params;

  const searchParams = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (search) searchParams.set("search", search);
  if (status) searchParams.set("status", status);

  const res = await fetch(
    `${FUNCTIONS_BASE}/restaurants-list?${searchParams.toString()}`,
    { headers: getAuthHeaders() }
  );
  return handleResponse<PaginatedResponse<Restaurant>>(res);
};

export const getRestaurantById = async (id: string) => {
  const res = await fetch(`${FUNCTIONS_BASE}/restaurants-get?id=${id}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse<ApiResponse<Restaurant>>(res);
};

export const createRestaurant = async (restaurantData: CreateRestaurantInput) => {
  const res = await fetch(`${FUNCTIONS_BASE}/restaurants-create`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(restaurantData),
  });
  return handleResponse<ApiResponse<Restaurant>>(res);
};

export const updateRestaurant = async (id: string, restaurantData: UpdateRestaurantInput) => {
  const res = await fetch(`${FUNCTIONS_BASE}/restaurants-update?id=${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(restaurantData),
  });
  return handleResponse<ApiResponse<Restaurant>>(res);
};

export const deleteRestaurant = async (id: string) => {
  const res = await fetch(`${FUNCTIONS_BASE}/restaurants-delete?id=${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return handleResponse<ApiResponse<void>>(res);
};
