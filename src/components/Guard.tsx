import React from "react";
import { usePermissions } from "@/hooks/usePermissions";
import { RoleName } from "@/types";

interface GuardProps {
  children: React.ReactNode;
  /** Permission name required (e.g. 'orders:create') */
  permission?: string;
  /** Role name required (e.g. RoleName.ADMIN) */
  role?: RoleName;
  /** Array of roles, at least one required */
  anyRole?: RoleName[];
  /** If true, the guard will only check if user is SuperAdmin */
  superAdminOnly?: boolean;
  /** Fallback content to show if access is denied (optional) */
  fallback?: React.ReactNode;
}

/**
 * GUARD COMPONENT
 * 
 * Declarative way to hide/show UI elements based on permissions or roles.
 * 
 * @example
 * <Guard permission="orders:create">
 *   <Button>Nuevo Pedido</Button>
 * </Guard>
 */
export function Guard({
  children,
  permission,
  role,
  anyRole,
  superAdminOnly,
  fallback = null,
}: GuardProps) {
  const { hasPermission, hasRole, hasAnyRole, isSuperAdmin } = usePermissions();

  // 1. SuperAdmin bypass or check
  if (isSuperAdmin()) {
    return <>{children}</>;
  }

  if (superAdminOnly) {
    return isSuperAdmin() ? <>{children}</> : <>{fallback}</>;
  }

  // 2. Permission check
  if (permission && !hasPermission(permission)) {
    return <>{fallback}</>;
  }

  // 3. Single role check
  if (role && !hasRole(role)) {
    return <>{fallback}</>;
  }

  // 4. Any role check
  if (anyRole && !hasAnyRole(anyRole)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
