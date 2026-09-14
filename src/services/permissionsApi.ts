/**
 * PERMISSIONS API SERVICE
 *
 * Services related to permission management
 * Uses Supabase Edge Functions
 */

import { FUNCTIONS_BASE, getStoredToken } from "@/lib/supabase";
import type {
  Permission,
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
} from "@/types";

export interface CreatePermissionInput {
  name: string;
  description?: string;
}

export interface UpdatePermissionInput {
  name?: string;
  description?: string;
}

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

export const getPermissions = async (params?: PaginationParams) => {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 100;

  const res = await fetch(
    `${FUNCTIONS_BASE}/permissions-list?page=${page}&limit=${limit}`,
    { headers: getAuthHeaders() }
  );
  return handleResponse<PaginatedResponse<Permission>>(res);
};

export const getPermissionById = async (id: number) => {
  const res = await fetch(`${FUNCTIONS_BASE}/permissions-list?id=${id}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse<ApiResponse<Permission>>(res);
};

export const createPermission = async (permissionData: CreatePermissionInput) => {
  const res = await fetch(`${FUNCTIONS_BASE}/permissions-list`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(permissionData),
  });
  return handleResponse<ApiResponse<Permission>>(res);
};

export const updatePermission = async (
  id: number,
  permissionData: UpdatePermissionInput
) => {
  const res = await fetch(`${FUNCTIONS_BASE}/permissions-list?id=${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(permissionData),
  });
  return handleResponse<ApiResponse<Permission>>(res);
};

export const deletePermission = async (id: number) => {
  const res = await fetch(`${FUNCTIONS_BASE}/permissions-list?id=${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return handleResponse<ApiResponse<null>>(res);
};
