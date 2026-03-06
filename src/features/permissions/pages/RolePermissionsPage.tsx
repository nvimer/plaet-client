import { useState } from "react";
import { useRolesWithPermissions, useAllPermissions, useAssignPermissions } from "../hooks/usePermissionsEditor";
import { RolePermissionMatrix } from "../components/RolePermissionMatrix";
import { Card } from "@/components/ui/Card/Card";
import { SidebarLayout } from "@/layouts/SidebarLayout";
import type { RoleWithPermissions } from "@/types";
import { 
  ShieldCheck, Check, X, Shield, Lock, Layout, 
  User, Users, Store, ClipboardList, Database, 
  Bell, Settings, Info, RefreshCw, ShieldAlert 
} from "lucide-react";

/**
 * PAGE: RolePermissionsPage
 */
export function RolePermissionsPage() {
  const { data: rolesResponse, isLoading: loadingRoles } = useRolesWithPermissions();
  const { data: permsResponse, isLoading: loadingPerms } = useAllPermissions();
  const assignMutation = useAssignPermissions();
  
  const [updatingRoleId, setUpdatingRoleId] = useState<number | null>(null);

  const handleTogglePermission = async (roleId: number, permissionId: number, isAssigned: boolean) => {
    const role = rolesResponse?.data.find((r) => r.id === roleId) as RoleWithPermissions;
    if (!role) return;

    // Get current permission IDs
    const currentPermIds = role.permissions?.map(
      (rp) => rp.permissionId || rp.permission?.id
    ) || [];

    let newPermIds: number[];
    if (isAssigned) {
      // Remove
      newPermIds = currentPermIds.filter((id: number) => id !== permissionId);
    } else {
      // Add
      newPermIds = [...currentPermIds, permissionId];
    }

    setUpdatingRoleId(roleId);
    try {
      await assignMutation.mutateAsync({ roleId, permissionIds: newPermIds });
    } finally {
      setUpdatingRoleId(null);
    }
  };

  const isLoading = loadingRoles || loadingPerms;

  return (
    <SidebarLayout hideTitle fullWidth>
      <div className="p-8 sm:p-12 lg:p-16 pb-24">
      {/* ============ PAGE HEADER =============== */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-sage-600">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-[10px] font-semibold tracking-[0.2em]">Configuración Global</span>
          </div>
          <h1 className="text-3xl font-bold text-carbon-900 tracking-tight">Roles y Permisos</h1>
          <p className="text-sm text-carbon-500 font-medium">Control granular de accesos y seguridad del sistema.</p>
        </div>
      </header>

      {/* Full Width Matrix */}
      <Card variant="elevated" className="p-0 max-w-3xl mx-auto">
        {isLoading ? (
          <div className="p-12 text-center text-carbon-500">
            <div className="animate-spin w-8 h-8 border-4 border-sage-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            Cargando matriz de permisos...
          </div>
        ) : (
          <RolePermissionMatrix
            roles={rolesResponse?.data || []}
            permissions={permsResponse?.data || []}
            onToggle={handleTogglePermission}
            isUpdating={assignMutation.isPending}
            updatingRoleId={updatingRoleId}
          />
        )}
      </Card>

      {/* Info Cards - Below matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 max-w-5xl mx-auto">
        <Card className="bg-warning-50 border-warning-100 p-6">
          <h3 className="text-warning-800 font-bold flex items-center gap-2 mb-3">
            <ShieldAlert className="w-5 h-5" />
            Zona Crítica
          </h3>
          <p className="text-sm text-warning-700 leading-relaxed">
            Los cambios en esta matriz se aplican de forma <strong>inmediata</strong> a todos los usuarios. 
            Ten cuidado al remover permisos de lectura, ya que pueden romper la experiencia de usuario.
          </p>
        </Card>

        <Card className="bg-sage-50 border-sage-100 p-6">
          <h3 className="text-sage-800 font-bold flex items-center gap-2 mb-3">
            <Info className="w-5 h-5" />
            Sugerencias
          </h3>
          <ul className="text-sm text-sage-700 space-y-2 list-disc pl-4">
            <li>El rol <strong>SUPERADMIN</strong> siempre tiene todos los permisos habilitados.</li>
            <li>Agrupa permisos por módulo para mantener el orden.</li>
            <li>Los cambios requieren que el usuario refresque su sesión para verse reflejados en la UI.</li>
          </ul>
        </Card>
      </div>
    </div>
  </SidebarLayout>
);
}
