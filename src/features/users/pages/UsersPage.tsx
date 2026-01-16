import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUsers } from "../hooks";
import { Button, Card, EmptyState, Skeleton } from "@/components";
import { UserCard } from "../components";
import { Plus, Users as UsersIcon } from "lucide-react";
import { ROUTES } from "@/app/routes";
import { usePermissions } from "@/hooks";
import { RoleName } from "@/types";

/**
 * UsersPage Component
 * 
 * Main page for user management (Admin only)
 * Displays list of users with ability to create, edit, and delete
 */
export function UsersPage() {
  const navigate = useNavigate();
  const { isAdmin } = usePermissions();
  const { data: users, isLoading, error } = useUsers();

  // ============= HANDLERS ===============
  const handleCreateUser = () => {
    navigate(ROUTES.USER_CREATE);
  };

  const handleEditUser = (userId: string) => {
    navigate(`/users/${userId}/edit`);
  };

  // ============ LOADING STATE ===========
  if (isLoading) {
    return (
      <>
        {/* Header Skeleton */}
        <div className="mb-8">
          <Skeleton variant="text" width={256} height={40} className="mb-2" />
          <Skeleton variant="text" width={384} height={24} />
        </div>

        {/* Users Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} variant="card" />
          ))}
        </div>
      </>
    );
  }

  // ========== ERROR STATE =============
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card variant="elevated" padding="lg">
          <div className="text-center p-8">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-2xl font-semibold text-carbon-900 mb-2">
              Error al cargar usuarios
            </h2>
            <p className="text-carbon-600 mb-4">{error.message}</p>
            <Button onClick={() => window.location.reload()}>
              Reintentar
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // =============== MAIN RENDER =================
  return (
    <>
      {/* ============ PAGE HEADER =============== */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-semibold text-carbon-900 tracking-tight">
            Gestión de Usuarios
          </h1>
          <p className="text-[15px] text-carbon-600 font-light">
            Administra los usuarios del sistema
          </p>
        </div>

        {/* New User Button */}
        {isAdmin() && (
          <Button
            variant="primary"
            size="lg"
            onClick={handleCreateUser}
          >
            <Plus className="w-5 h-5 mr-2" />
            Nuevo Usuario
          </Button>
        )}
      </div>

      {/* ============ USERS GRID ============== */}
      {users && users.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onEdit={handleEditUser}
              canEdit={isAdmin()}
              canDelete={false} // Por ahora no implementamos delete
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<UsersIcon />}
          title="No hay usuarios"
          description="Crea tu primer usuario para comenzar a gestionar el sistema"
          actionLabel={isAdmin() ? "Crear Primer Usuario" : undefined}
          onAction={isAdmin() ? handleCreateUser : undefined}
          size="lg"
        />
      )}
    </>
  );
}
