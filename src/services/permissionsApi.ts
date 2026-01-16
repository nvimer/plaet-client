/**
 * PERMISSIONS API SERVICE
 * 
 * Services related to permission management
 * Base Endpoints: /permissions/*
 */

import axiosClient from "./axiosClient";
import type {
  Permission,
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
} from "@/types";

/**
 * Permission creation input
 */
export interface CreatePermissionInput {
  name: string;
  description?: string;
}

/**
 * Permission update input
 */
export interface UpdatePermissionInput {
  name?: string;
  description?: string;
}

/**
 * GET /permissions
 * 
 * Get paginated list of permissions
 */
export const getPermissions = async (params?: PaginationParams) => {
  const { data } = await axiosClient.get<PaginatedResponse<Permission>>(
    "/permissions",
    { params }
  );
  return data;
};

/**
 * GET /permissions/:id
 * 
 * Get single permission by ID
 */
export const getPermissionById = async (id: number) => {
  const { data } = await axiosClient.get<ApiResponse<Permission>>(
    `/permissions/${id}`
  );
  return data;
};

/**
 * POST /permissions
 * 
 * Create a new permission
 */
export const createPermission = async (permissionData: CreatePermissionInput) => {
  const { data } = await axiosClient.post<ApiResponse<Permission>>(
    "/permissions",
    permissionData
  );
  return data;
};

/**
 * PATCH /permissions/:id
 * 
 * Update an existing permission
 */
export const updatePermission = async (
  id: number,
  permissionData: UpdatePermissionInput
) => {
  const { data } = await axiosClient.patch<ApiResponse<Permission>>(
    `/permissions/${id}`,
    permissionData
  );
  return data;
};

/**
 * DELETE /permissions/:id
 * 
 * Delete a permission (soft delete)
 */
export const deletePermission = async (id: number) => {
  const { data } = await axiosClient.delete<ApiResponse<null>>(
    `/permissions/${id}`
  );
  return data;
};
