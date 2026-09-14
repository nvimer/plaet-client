/**
 * ROLES API SERVICE
 *
 * Services related to role management
 * Uses Supabase Edge Functions
 */

import { FUNCTIONS_BASE, getStoredToken } from "@/lib/supabase";
import type {
  Role,
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
} from "@/types";

export interface CreateRoleInput {
  name: string;
  description?: string;
}

export interface UpdateRoleInput {
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

export const getRoles = async (params?: PaginationParams) => {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 100;

  const res = await fetch(
    `${FUNCTIONS_BASE}/roles-list?page=${page}&limit=${limit}`,
    { headers: getAuthHeaders() }
  );
  return handleResponse<PaginatedResponse<Role>>(res);
};

export const getRoleById = async (id: number) => {
  const res = await fetch(`${FUNCTIONS_BASE}/roles-get?id=${id}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse<ApiResponse<Role>>(res);
};

export const createRole = async (roleData: CreateRoleInput) => {
  const res = await fetch(`${FUNCTIONS_BASE}/roles-create`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(roleData),
  });
  return handleResponse<ApiResponse<Role>>(res);
};

export const updateRole = async (id: number, roleData: UpdateRoleInput) => {
  const res = await fetch(`${FUNCTIONS_BASE}/roles-update?id=${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(roleData),
  });
  return handleResponse<ApiResponse<Role>>(res);
};

export const deleteRole = async (id: number) => {
  const res = await fetch(`${FUNCTIONS_BASE}/roles-delete?id=${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return handleResponse<ApiResponse<null>>(res);
};

export const assignPermissionsToRole = async (
  roleId: number,
  permissionIds: number[]
) => {
  const res = await fetch(
    `${FUNCTIONS_BASE}/roles-assign-permissions?id=${roleId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({ permissionIds }),
    }
  );
  return handleResponse<ApiResponse<Role>>(res);
};
