import { useState } from "react";
import { useRolesWithPermissions, useAllPermissions, useAssignPermissions } from "../hooks/usePermissionsEditor";
import { RolePermissionMatrix } from "../components/RolePermissionMatrix";
import { Card } from "@/components/ui/Card/Card";
import { ShieldAlert, Info, ShieldCheck } from "lucide-react";

export function RolePermissionsPage() {
  const { data: rolesResponse, isLoading: loadingRoles } = useRolesWithPermissions();
  const { data: permsResponse, isLoading: loadingPerms } = useAllPermissions();
  const assignMutation = useAssignPermissions();
  
  const [updatingRoleId, setUpdatingRoleId] = useState<number | null>(null);

  const handleTogglePermission = async (roleId: number, permissionId: number, isAssigned: boolean) => {
    const role = rolesResponse?.data.find((r) => r.id === roleId);
    if (!role) return;

    // Get current permission IDs
    const currentPermIds = (role as any).permissions?.map(
      (rp: any) => rp.permissionId || rp.permission?.id
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
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary-600 mb-1">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-widest">Seguridad</span>
          </div>
          <h1 className="text-2xl font-bold text-carbon-900">Roles y Permisos Granulares</h1>
          <p className="text-carbon-500">Configura qué acciones puede realizar cada perfil de usuario.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card variant="elevated" className="lg:col-span-2 p-0 overflow-hidden">
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

        <div className="space-y-6">
          <Card className="bg-amber-50 border-amber-100 p-6">
            <h3 className="text-amber-800 font-bold flex items-center gap-2 mb-3">
              <ShieldAlert className="w-5 h-5" />
              Zona Crítica
            </h3>
            <p className="text-sm text-amber-700 leading-relaxed">
              Los cambios en esta matriz se aplican de forma **inmediata** a todos los usuarios. 
              Ten cuidado al remover permisos de lectura, ya que pueden romper la experiencia de usuario.
            </p>
          </Card>

          <Card className="bg-sage-50 border-sage-100 p-6">
            <h3 className="text-sage-800 font-bold flex items-center gap-2 mb-3">
              <Info className="w-5 h-5" />
              Sugerencias
            </h3>
            <ul className="text-sm text-sage-700 space-y-2 list-disc pl-4">
              <li>El rol **SUPERADMIN** siempre tiene todos los permisos habilitados.</li>
              <li>Agrupa permisos por módulo para mantener el orden.</li>
              <li>Los cambios requieren que el usuario refresque su sesión para verse reflejados en la UI.</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
