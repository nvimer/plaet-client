import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useRoles, useDeleteRole } from "../hooks";
import {
  Button,
  Card,
  EmptyState,
  Skeleton,
  Input,
} from "@/components";
import { SidebarLayout } from "@/layouts/SidebarLayout";
import { ROUTES } from "@/app/routes";
import {
  Plus,
  Shield,
  ShieldCheck,
  Edit,
  Trash2,
  Users,
  Key,
} from "lucide-react";
import { toast } from "sonner";
import type { RoleWithPermissions } from "@/types";
import { RoleName } from "@/types";
import { useAuth } from "@/hooks";

const ROLE_NAME_MAP: Record<string, string> = {
  SUPERADMIN: "Superadministrador",
  ADMIN: "Administrador",
  KITCHEN_MANAGER: "Jefe de Cocina",
  CASHIER: "Cajero",
  WAITER: "Mesero",
};

export function RolesListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: rolesData, isLoading } = useRoles({ limit: 100 });
  const deleteMutation = useDeleteRole();
  const [searchQuery, setSearchQuery] = useState("");

  const isSuperAdmin = user?.roles?.some(r => {
    const roleName = typeof r === 'object' && 'role' in r ? r.role.name : (r as any).name;
    return roleName === RoleName.SUPERADMIN;
  });

  const roles = rolesData?.data || [];

  const filteredRoles = roles.filter((role) => {
    // Backend should already filter this, but double safeguard
    if (role.name === RoleName.SUPERADMIN && !isSuperAdmin) return false;

    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    const nameEs = ROLE_NAME_MAP[role.name] || role.name;
    return (
      nameEs.toLowerCase().includes(search) ||
      role.name.toLowerCase().includes(search) ||
      role.description?.toLowerCase().includes(search)
    );
  });

  const handleDelete = async (role: RoleWithPermissions) => {
    if (role.name === RoleName.SUPERADMIN) {
      toast.error("No puedes eliminar el rol de Superadministrador");
      return;
    }

    const usersCount = role._count?.users || 0;
    if (usersCount > 0) {
      toast.error(
        "No puedes eliminar este rol porque tiene usuarios asignados"
      );
      return;
    }

    if (!confirm(`¿Estás seguro de eliminar el rol "${role.name}"?`)) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(role.id);
    } catch {
      // Error is handled by the mutation
    }
  };

  const getRoleDisplayName = (roleName: string) => {
    return ROLE_NAME_MAP[roleName] || roleName;
  };

  return (
    <SidebarLayout title="Roles" backRoute={ROUTES.ADMIN}>
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-carbon-900">Gestión de Roles</h1>
            <p className="text-carbon-500 mt-1">
              Administra los roles y permisos del sistema
            </p>
          </div>
          {isSuperAdmin && (
            <Button
              variant="primary"
              onClick={() => navigate(ROUTES.ROLE_CREATE)}
            >
              <Plus className="w-5 h-5 mr-2" />
              Nuevo Rol
            </Button>
          )}
        </div>

        <div className="mb-6">
          <Input
            placeholder="Buscar roles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-40 rounded-2xl" />
            ))}
          </div>
        ) : filteredRoles.length === 0 ? (
          <EmptyState
            icon={<Shield />}
            title="No hay roles"
            description={
              searchQuery
                ? "No se encontraron roles con ese nombre"
                : "No tienes roles asignados a tu restaurante"
            }
            action={
              !searchQuery && isSuperAdmin && (
                <Button variant="primary" onClick={() => navigate(ROUTES.ROLE_CREATE)}>
                  <Plus className="w-5 h-5 mr-2" />
                  Crear Rol
                </Button>
              )
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRoles.map((role) => (
              <RoleCard
                key={role.id}
                role={role}
                displayName={getRoleDisplayName(role.name)}
                onEdit={() => navigate(ROUTES.getRoleEditRoute(role.id))}
                onDelete={() => handleDelete(role)}
                onPermissions={() => navigate(ROUTES.PERMISSIONS)}
              />
            ))}
          </div>
        )}
      </div>
    </SidebarLayout>
  );
}

interface RoleCardProps {
  role: RoleWithPermissions;
  displayName: string;
  onEdit: () => void;
  onDelete: () => void;
  onPermissions: () => void;
}

function RoleCard({
  role,
  displayName,
  onEdit,
  onDelete,
  onPermissions,
}: RoleCardProps) {
  const isSystemRole = ["SUPERADMIN", "ADMIN", "KITCHEN_MANAGER", "CASHIER", "WAITER"].includes(role.name);
  const permissionCount = role.permissions?.length || 0;
  const usersCount = role._count?.users || 0;

  return (
    <Card
      variant="elevated"
      padding="md"
      className="hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className={`p-2.5 rounded-xl ${
            role.name === "SUPERADMIN"
              ? "bg-warning-100 text-warning-600"
              : "bg-sage-100 text-sage-600"
          }`}
        >
          {role.name === "SUPERADMIN" ? (
            <ShieldCheck className="w-5 h-5" />
          ) : (
            <Shield className="w-5 h-5" />
          )}
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onPermissions}
            title="Gestionar permisos"
          >
            <Key className="w-4 h-4 text-carbon-500" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            title="Editar"
          >
            <Edit className="w-4 h-4 text-carbon-500" />
          </Button>
          {!isSystemRole && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              title="Eliminar"
              disabled={usersCount > 0}
            >
              <Trash2 className="w-4 h-4 text-error-500" />
            </Button>
          )}
        </div>
      </div>

      <h3 className="font-semibold text-carbon-900 mb-1">{displayName}</h3>
      <p className="text-sm text-carbon-500 mb-4 line-clamp-2">
        {role.description || "Sin descripción"}
      </p>

      <div className="flex items-center gap-4 text-xs text-carbon-400 pt-3 border-t border-carbon-100">
        <div className="flex items-center gap-1">
          <Key className="w-3.5 h-3.5" />
          <span>{permissionCount} permisos</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-3.5 h-3.5" />
          <span>{usersCount} usuarios</span>
        </div>
      </div>
    </Card>
  );
}
