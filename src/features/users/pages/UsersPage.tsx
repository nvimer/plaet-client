import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { useUsers } from "../hooks";
import {
  Button,
  Skeleton,
  EmptyState,
  Card,
  FilterPills,
  FilterSearch,
} from "@/components";
import { Plus, Users as UsersIcon, Shield, Utensils, UserCheck, X } from "lucide-react";
import { UserCard } from "../components";
import { ROUTES } from "@/app/routes";
import { usePermissions } from "@/hooks";
import { RoleName } from "@/types";
import { SidebarLayout } from "@/layouts/SidebarLayout";

/**
 * UsersPage Component
 *
 * User management with unified design: filters, stats cards,
 * improved grid layout, and responsive design.
 */
export function UsersPage() {
  const navigate = useNavigate();
  const { isAdmin } = usePermissions();
  const { data: users, isLoading, error } = useUsers();

  // ============ STATE =============
  const [roleFilter, setRoleFilter] = useState<RoleName | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // ============== COMPUTED VALUES =================
  const filteredUsers = useMemo(() => {
    if (!users) return [];
    return users.filter((user) => {
      // Role filter
      const matchesRole =
        roleFilter === "ALL" ||
        user.roles?.some((role) => {
          if ("role" in role) {
            return role.role.name === roleFilter;
          }
          return role.name === roleFilter;
        });

      // Search filter (name or email)
      const searchLower = searchQuery.toLowerCase();
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      const matchesSearch =
        searchQuery === "" ||
        fullName.includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower);

      return matchesRole && matchesSearch;
    });
  }, [users, roleFilter, searchQuery]);

  const counts = useMemo(() => {
    if (!users) {
      return {
        all: 0,
        admin: 0,
        waiter: 0,
        kitchen: 0,
        cashier: 0,
      };
    }

    const getRoleName = (user: (typeof users)[0]): string | null => {
      if (!user.roles || user.roles.length === 0) return null;
      const firstRole = user.roles[0];
      if ("role" in firstRole) {
        return firstRole.role.name;
      }
      return firstRole.name;
    };

    return {
      all: users.length,
      admin: users.filter((u) => getRoleName(u) === RoleName.ADMIN).length,
      waiter: users.filter((u) => getRoleName(u) === RoleName.WAITER).length,
      kitchen: users.filter((u) => getRoleName(u) === RoleName.KITCHEN_MANAGER)
        .length,
      cashier: users.filter((u) => getRoleName(u) === RoleName.CASHIER).length,
    };
  }, [users]);

  const hasActiveFilters = roleFilter !== "ALL" || searchQuery !== "";

  // Filter options for pills
  const roleOptions = [
    { value: "ALL", label: "Todos", count: counts.all },
    { value: RoleName.ADMIN, label: "Admin", count: counts.admin },
    { value: RoleName.WAITER, label: "Mesero", count: counts.waiter },
    { value: RoleName.KITCHEN_MANAGER, label: "Cocina", count: counts.kitchen },
    { value: RoleName.CASHIER, label: "Cajero", count: counts.cashier },
  ];

  // ============= HANDLERS ===============
  const handleCreateUser = () => {
    navigate(ROUTES.USER_CREATE);
  };

  const handleEditUser = (userId: string) => {
    navigate(`/users/${userId}/edit`);
  };

  const handleClearFilters = () => {
    setRoleFilter("ALL");
    setSearchQuery("");
  };

  const handleRoleChange = (value: string) => {
    setRoleFilter(value as RoleName | "ALL");
  };

  // ============ LOADING STATE ===========
  if (isLoading) {
    return (
      <>
        {/* Header Skeleton */}
        <div className="mb-8">
          <Skeleton variant="text" width={280} height={32} className="mb-2" />
          <Skeleton variant="text" width={320} height={20} />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} variant="card" height={80} />
          ))}
        </div>

        {/* Filters Skeleton */}
        <Skeleton variant="card" height={60} className="mb-6" />

        {/* Users Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} variant="card" height={180} />
          ))}
        </div>
      </>
    );
  }

  // ========== ERROR STATE =============
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Card
          variant="elevated"
          padding="lg"
          className="max-w-md w-full border border-sage-200 shadow-sm rounded-2xl"
        >
          <div className="text-center">
            <div className="w-14 h-14 bg-rose-50 rounded-xl flex items-center justify-center mx-auto mb-4 text-rose-500">
              <UsersIcon className="w-7 h-7" />
            </div>
            <h2 className="text-lg font-semibold text-carbon-900 mb-2">
              Error al cargar usuarios
            </h2>
            <p className="text-carbon-500 text-sm mb-6">{error.message}</p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => window.location.reload()}
              fullWidth
              className="min-h-[44px]"
            >
              Reintentar
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // =============== MAIN RENDER =================
  return (
    <SidebarLayout hideHeader fullWidth>
      <div className="px-4 sm:px-6 lg:px-8 space-y-8 pb-24">
      {/* ============ PAGE HEADER =============== */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-sage-600">
            <UsersIcon className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Recursos Humanos</span>
          </div>
          <h1 className="text-3xl font-bold text-carbon-900 tracking-tight">Gestión de Usuarios</h1>
          <p className="text-sm text-carbon-500 font-medium">Administra el personal, roles y accesos del sistema.</p>
        </div>
        
        {isAdmin() && (
          <Button
            size="lg"
            variant="primary"
            onClick={handleCreateUser}
            className="rounded-2xl h-14 px-8 shadow-soft-lg transition-all active:scale-95 font-bold"
          >
            <Plus className="w-5 h-5 mr-2 stroke-[3px]" />
            Nuevo Usuario
          </Button>
        )}
      </header>

      {/* ================ STATS CARDS ================== */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl border-2 border-sage-200 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center text-sage-600">
              <UsersIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-carbon-500">Total</p>
              <p className="text-xl font-bold text-carbon-900">{counts.all}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border-2 border-sage-200 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-carbon-500">Admins</p>
              <p className="text-xl font-bold text-carbon-900">{counts.admin}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border-2 border-sage-200 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-carbon-500">Meseros</p>
              <p className="text-xl font-bold text-carbon-900">{counts.waiter}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border-2 border-sage-200 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-carbon-500">Cocina</p>
              <p className="text-xl font-bold text-carbon-900">{counts.kitchen}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ================ FILTERS ================= */}
      <div className="bg-white rounded-2xl border border-sage-200 p-4 mb-6 shadow-sm">
        {/* Search Input */}
        <div className="mb-4">
          <FilterSearch
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Buscar por nombre o email..."
          />
        </div>

        {/* Role Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <FilterPills
            label="Filtrar por rol:"
            options={roleOptions}
            value={roleFilter}
            onChange={handleRoleChange}
            className="flex-1"
          />

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="text-sm text-sage-600 hover:text-sage-700 font-medium flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-sage-50 transition-colors whitespace-nowrap"
            >
              <X className="w-4 h-4" />
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Result count */}
      <p className="text-sm font-medium text-carbon-600 mb-5">
        {filteredUsers.length}{" "}
        {filteredUsers.length === 1 ? "usuario" : "usuarios"}
        {hasActiveFilters && " encontrados"}
      </p>

      {/* ============ USERS GRID ============== */}
      {filteredUsers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onEdit={handleEditUser}
              canEdit={isAdmin()}
              canDelete={false}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<UsersIcon />}
          title={
            hasActiveFilters
              ? "No hay usuarios con estos filtros"
              : "No hay usuarios"
          }
          description={
            hasActiveFilters
              ? "Ajusta los filtros para ver más resultados"
              : "Crea tu primer usuario para comenzar a gestionar el sistema"
          }
          actionLabel={
            !hasActiveFilters && isAdmin() ? "Crear Primer Usuario" : undefined
          }
          onAction={
            !hasActiveFilters && isAdmin() ? handleCreateUser : undefined
          }
                  />
                        )}
                      </div>
                    </SidebarLayout>
                  );
                }
                
