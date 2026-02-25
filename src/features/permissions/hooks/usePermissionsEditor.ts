import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRoles, getRoleWithPermissions, assignPermissionsToRole } from "@/services/rolesApi";
import { getPermissions } from "@/services/permissionsApi";
import { toast } from "sonner";
import type { RoleWithPermissions } from "@/types";

export const PERMISSION_KEYS = {
  all: ["permissions-editor"] as const,
  roles: () => [...PERMISSION_KEYS.all, "roles"] as const,
  permissions: () => [...PERMISSION_KEYS.all, "list"] as const,
  roleWithPerms: (id: number) => [...PERMISSION_KEYS.roles(), id, "perms"] as const,
};

export function useRolesWithPermissions() {
  return useQuery({
    queryKey: PERMISSION_KEYS.roles(),
    queryFn: async () => {
      const response = await getRoles({ page: 1, limit: 100 });
      return {
        ...response,
        data: response.data as RoleWithPermissions[],
      };
    },
  });
}

export function useAllPermissions() {
  return useQuery({
    queryKey: PERMISSION_KEYS.permissions(),
    queryFn: () => getPermissions({ page: 1, limit: 200 }),
  });
}

export function useAssignPermissions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roleId, permissionIds }: { roleId: number; permissionIds: number[] }) =>
      assignPermissionsToRole(roleId, permissionIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PERMISSION_KEYS.roles() });
      toast.success("Permisos actualizados correctamente");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Error al actualizar permisos");
    },
  });
}
