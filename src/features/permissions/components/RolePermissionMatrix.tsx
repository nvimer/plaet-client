import { Permission, Role } from "@/types";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";

interface RolePermissionMatrixProps {
  roles: Role[];
  permissions: Permission[];
  onToggle: (roleId: number, permissionId: number, isAssigned: boolean) => void;
  isUpdating?: boolean;
  updatingRoleId?: number | null;
}

export function RolePermissionMatrix({
  roles,
  permissions,
  onToggle,
  isUpdating,
  updatingRoleId,
}: RolePermissionMatrixProps) {
  
  // Group permissions by category (first part of name before ':')
  const categories = Array.from(
    new Set(permissions.map((p) => p.name.split(":")[0]))
  ).sort();

  return (
    <div className="overflow-x-auto rounded-xl border border-carbon-100 bg-white">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="bg-carbon-50 border-b border-carbon-100">
            <th className="py-4 px-6 text-sm font-bold text-carbon-700 w-[300px] sticky left-0 bg-carbon-50 z-10">
              Permiso / Módulo
            </th>
            {roles.map((role) => (
              <th key={role.id} className="py-4 px-4 text-sm font-bold text-carbon-700 text-center">
                <div className="flex flex-col items-center gap-1">
                  <span>{role.name}</span>
                  {isUpdating && updatingRoleId === role.id && (
                    <Loader2 className="w-3 h-3 animate-spin text-sage-600" />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <React.Fragment key={category}>
              {/* Category Header */}
              <tr className="bg-sage-50/50">
                <td 
                  colSpan={roles.length + 1} 
                  className="py-2 px-6 text-[10px] font-black uppercase tracking-widest text-sage-700 border-y border-carbon-50"
                >
                  Módulo: {category}
                </td>
              </tr>
              
              {/* Permissions in this category */}
              {permissions
                .filter((p) => p.name.startsWith(`${category}:`))
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((permission) => (
                  <tr key={permission.id} className="border-b border-carbon-50 hover:bg-carbon-50/30 transition-colors">
                    <td className="py-3 px-6 sticky left-0 bg-white z-10">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-carbon-900">{permission.name}</span>
                        <span className="text-xs text-carbon-400">{permission.description}</span>
                      </div>
                    </td>
                    {roles.map((role) => {
                      // Check if role has this permission
                      // Note: role.permissions usually comes as { permission: Permission }[] from backend
                      const isAssigned = (role as any).permissions?.some(
                        (rp: any) => rp.permissionId === permission.id || rp.permission?.id === permission.id
                      );

                      return (
                        <td key={`${role.id}-${permission.id}`} className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => onToggle(role.id, permission.id, isAssigned)}
                            disabled={isUpdating || role.name === "SUPERADMIN"}
                            className={cn(
                              "w-6 h-6 rounded-md border-2 transition-all mx-auto flex items-center justify-center",
                              role.name === "SUPERADMIN" 
                                ? "bg-sage-100 border-sage-200 cursor-not-allowed opacity-70" 
                                : isAssigned
                                  ? "bg-sage-500 border-sage-500 text-white shadow-sm"
                                  : "bg-white border-carbon-200 hover:border-sage-300"
                            )}
                          >
                            {(isAssigned || role.name === "SUPERADMIN") && <Check className="w-4 h-4 stroke-[3px]" />}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import React from "react";
