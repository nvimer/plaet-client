/**
 * USERS API SERVICE
 *
 * Services related to user management
 * Base Endpoints: /users/*
 */

import { callFunction, query } from "./functionsClient";
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

  return await callFunction<User[]>(`users-list${query(queryParams)}`) as unknown as PaginatedResponse<User>;
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
  return await callFunction<User>(`users-get${query({ id })}`) as unknown as ApiResponse<User>;
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
  return await callFunction<UserWithRolesAndPermissions>(
    `users-get${query({ id, withPermissions: true })}`,
  ) as unknown as ApiResponse<UserWithRolesAndPermissions>;
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
  return await callFunction<User>("auth-register", {
    method: "POST",
    body: JSON.stringify(userData),
  }) as unknown as ApiResponse<User>;
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
  return await callFunction<User>(`users-update${query({ id })}`, {
    method: "PATCH",
    body: JSON.stringify(userData),
  }) as unknown as ApiResponse<User>;
};
