import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  type CreateRoleInput,
  type UpdateRoleInput,
} from "@/services/rolesApi";
import { toast } from "sonner";
import type { RoleWithPermissions } from "@/types";

export const ROLE_KEYS = {
  all: ["roles"] as const,
  lists: () => [...ROLE_KEYS.all, "list"] as const,
  list: (params?: { page?: number; limit?: number }) =>
    [...ROLE_KEYS.lists(), params] as const,
  details: () => [...ROLE_KEYS.all, "detail"] as const,
  detail: (id: number) => [...ROLE_KEYS.details(), id] as const,
};

export function useRoles(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ROLE_KEYS.list(params),
    queryFn: async () => {
      const response = await getRoles(params);
      return {
        ...response,
        data: response.data as RoleWithPermissions[],
      };
    },
  });
}

export function useRole(id: number) {
  return useQuery({
    queryKey: ROLE_KEYS.detail(id),
    queryFn: async () => {
      const response = await getRoleById(id);
      return response.data as RoleWithPermissions;
    },
    enabled: !!id,
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRoleInput) => createRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROLE_KEYS.lists() });
      toast.success("Rol creado exitosamente");
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : "Error al crear el rol");
    },
  });
}

export function useUpdateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateRoleInput }) =>
      updateRole(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ROLE_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: ROLE_KEYS.detail(id) });
      toast.success("Rol actualizado exitosamente");
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : "Error al actualizar el rol");
    },
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROLE_KEYS.lists() });
      toast.success("Rol eliminado exitosamente");
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : "Error al eliminar el rol");
    },
  });
}
