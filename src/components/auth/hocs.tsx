import React from "react";
import ProtectedRoute from "./ProtectedRoute";

interface WithAuthOptions {
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: WithAuthOptions,
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <ProtectedRoute
        redirectTo={options?.redirectTo}
        fallback={options?.fallback}
      >
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}

interface WithRoleOptions {
  fallback?: React.ReactNode;
}

export function withRole<P extends object>(
  Component: React.ComponentType<P>,
  requiredRole: string,
  options?: WithRoleOptions,
) {
  return function RoleProtectedComponent(props: P) {
    return (
      <ProtectedRoute requiredRole={requiredRole} fallback={options?.fallback}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}

interface WithPermissionOptions {
  fallback?: React.ReactNode;
}

export function withPermission<P extends object>(
  Component: React.ComponentType<P>,
  requiredPermission: string,
  options?: WithPermissionOptions,
) {
  return function PermissionProtectedComponent(props: P) {
    return (
      <ProtectedRoute
        requiredPermission={requiredPermission}
        fallback={options?.fallback}
      >
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}
