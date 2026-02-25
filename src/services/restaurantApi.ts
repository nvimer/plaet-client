/**
 * RESTAURANTS API SERVICE
 *
 * Services related to restaurant management (SuperAdmin only)
 * Base Endpoints: /restaurants/*
 */

import axiosClient from "./axiosClient";
import type {
  Restaurant,
  CreateRestaurantInput,
  UpdateRestaurantInput,
  RestaurantSearchParams,
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
} from "@/types";

/**
 * GET /restaurants
 *
 * Get paginated list of all restaurants
 *
 * @param params - Pagination parameters
 * @returns Paginated list of restaurants
 */
export const getRestaurants = async (params?: PaginationParams) => {
  const pageValue = params?.page ?? 1;
  const limitValue = params?.limit ?? 20;

  const queryParams = {
    page: String(pageValue),
    limit: String(limitValue),
  };

  const { data } = await axiosClient.get<PaginatedResponse<Restaurant>>("restaurants", {
    params: queryParams,
  });
  return data;
};

/**
 * GET /restaurants/search
 *
 * Search restaurants with filters
 */
export const searchRestaurants = async (params: PaginationParams & RestaurantSearchParams) => {
  const { page = 1, limit = 20, search, status } = params;

  const queryParams: any = {
    page: String(page),
    limit: String(limit),
  };

  if (search) queryParams.search = search;
  if (status) queryParams.status = status;

  const { data } = await axiosClient.get<PaginatedResponse<Restaurant>>("restaurants/search", {
    params: queryParams,
  });
  return data;
};

/**
 * GET /restaurants/:id
 *
 * Get single restaurant by ID
 */
export const getRestaurantById = async (id: string) => {
  const { data } = await axiosClient.get<ApiResponse<Restaurant>>(`restaurants/${id}`);
  return data;
};

/**
 * POST /restaurants
 *
 * Create a new restaurant and its admin user
 */
export const createRestaurant = async (restaurantData: CreateRestaurantInput) => {
  const { data } = await axiosClient.post<ApiResponse<Restaurant>>(
    "restaurants",
    restaurantData,
  );
  return data;
};

/**
 * PATCH /restaurants/:id
 *
 * Update a restaurant
 */
export const updateRestaurant = async (id: string, restaurantData: UpdateRestaurantInput) => {
  const { data } = await axiosClient.patch<ApiResponse<Restaurant>>(
    `restaurants/${id}`,
    restaurantData,
  );
  return data;
};

/**
 * DELETE /restaurants/:id
 *
 * Soft delete a restaurant
 */
export const deleteRestaurant = async (id: string) => {
  const { data } = await axiosClient.delete<ApiResponse<void>>(`restaurants/${id}`);
  return data;
};
