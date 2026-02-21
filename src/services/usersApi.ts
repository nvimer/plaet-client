/**
 * USERS API SERVICE
 *
 * Services related to user management
 * Base Endpoints: /users/*
 */

import axiosClient from "./axiosClient";
import type {
  User,
  UserWithRolesAndPermissions,
  RegisterInput,
  UpdateUserInput,
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
} from "@/types";

/**
 * GET /users
 *
 * Get paginated list of users
 *
 * @param params - Pagination parameters (optional, defaults to page 1, limit 20)
 * @returns Paginated list of users
 */
export const getUsers = async (params?: PaginationParams) => {
  // Backend controller uses parseInt() directly without fallback
  // Unlike tables controller which has || DEFAULT_PAGE fallback
  // Always send page and limit as strings to ensure parseInt() works correctly
  const pageValue = params?.page ?? 1;
  const limitValue = params?.limit ?? 20;

  // Ensure we have valid numbers, then convert to strings
  // This ensures parseInt() in backend will work correctly
  const page = isNaN(Number(pageValue)) ? 1 : Number(pageValue);
  const limit = isNaN(Number(limitValue)) ? 20 : Number(limitValue);

  const queryParams = {
    page: String(page),
    limit: String(limit),
  };

  const { data } = await axiosClient.get<PaginatedResponse<User>>("users", {
    params: queryParams,
  });
  return data;
};

/**
 * GET /users/:id
 *
 * Get single user by ID
 *
 * @param id - User ID
 * @returns User data
 */
export const getUserById = async (id: string) => {
  const { data } = await axiosClient.get<ApiResponse<User>>(`users/${id}`);
  return data;
};

/**
 * GET /users/:id/roles-permissions
 *
 * Get user with roles and permissions
 *
 * @param id - User ID
 * @returns User with roles and permissions
 */
export const getUserWithRolesAndPermissions = async (id: string) => {
  const { data } = await axiosClient.get<
    ApiResponse<UserWithRolesAndPermissions>
  >(`users/${id}/roles-permissions`);
  return data;
};

/**
 * POST /users/register
 *
 * Register a new user
 *
 * @param userData - User registration data
 * @returns Created user
 */
export const registerUser = async (userData: RegisterInput) => {
  const { data } = await axiosClient.post<ApiResponse<User>>(
    "auth/register",
    userData,
  );
  return data;
};

/**
 * PATCH /users/:id
 *
 * Update an existing user
 *
 * @param id - User ID
 * @param userData - Data to update
 * @returns Updated user
 */
export const updateUser = async (id: string, userData: UpdateUserInput) => {
  const { data } = await axiosClient.patch<ApiResponse<User>>(
    `users/${id}`,
    userData,
  );
  return data;
};
