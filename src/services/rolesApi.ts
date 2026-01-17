/**
 * ROLES API SERVICE
 * 
 * Services related to role management
 * Base Endpoints: /roles/*
 */

import axiosClient from "./axiosClient";
import type {
  Role,
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
} from "@/types";

/**
 * Role creation input
 */
export interface CreateRoleInput {
  name: string;
  description?: string;
}

/**
 * Role update input
 */
export interface UpdateRoleInput {
  name?: string;
  description?: string;
}

/**
 * Assign permissions to role input
 */
export interface AssignPermissionsInput {
  permissionIds: number[];
}

/**
 * GET /roles
 * 
 * Get paginated list of roles
 */
export const getRoles = async (params?: PaginationParams) => {
  // Always send pagination params to ensure backend receives valid values
  const pageValue = params?.page ?? 1;
  const limitValue = params?.limit ?? 100; // Get all roles by default

  const page = isNaN(Number(pageValue)) ? 1 : Number(pageValue);
  const limit = isNaN(Number(limitValue)) ? 100 : Number(limitValue);

  const queryParams = {
    page: String(page),
    limit: String(limit),
  };

  const { data } = await axiosClient.get<PaginatedResponse<Role>>("/roles", {
    params: queryParams,
  });

  return data;
};

/**
 * GET /roles/:id
 * 
 * Get single role by ID
 */
export const getRoleById = async (id: number) => {
  const { data } = await axiosClient.get<ApiResponse<Role>>(`/roles/${id}`);
  return data;
};

/**
 * GET /roles/permissions/:id
 * 
 * Get role with permissions
 */
export const getRoleWithPermissions = async (id: number) => {
  const { data } = await axiosClient.get<ApiResponse<Role>>(
    `/roles/permissions/${id}`
  );
  return data;
};

/**
 * POST /roles
 * 
 * Create a new role
 */
export const createRole = async (roleData: CreateRoleInput) => {
  const { data } = await axiosClient.post<ApiResponse<Role>>(
    "/roles",
    roleData
  );
  return data;
};

/**
 * PATCH /roles/:id
 * 
 * Update an existing role
 */
export const updateRole = async (id: number, roleData: UpdateRoleInput) => {
  const { data } = await axiosClient.patch<ApiResponse<Role>>(
    `/roles/${id}`,
    roleData
  );
  return data;
};

/**
 * DELETE /roles/:id
 * 
 * Delete a role (soft delete)
 */
export const deleteRole = async (id: number) => {
  const { data } = await axiosClient.delete<ApiResponse<null>>(`/roles/${id}`);
  return data;
};

/**
 * POST /roles/permissions/:id/assign
 * 
 * Assign permissions to a role
 */
export const assignPermissionsToRole = async (
  roleId: number,
  permissionIds: number[]
) => {
  const { data } = await axiosClient.post<ApiResponse<Role>>(
    `/roles/permissions/${roleId}/assign`,
    { permissionIds }
  );
  return data;
};

/**
 * DELETE /roles/permissions/:id/remove
 * 
 * Remove permissions from a role
 */
export const removePermissionsFromRole = async (
  roleId: number,
  permissionIds: number[]
) => {
  const { data } = await axiosClient.delete<ApiResponse<Role>>(
    `/roles/permissions/${roleId}/remove`,
    { data: { permissionIds } }
  );
  return data;
};
