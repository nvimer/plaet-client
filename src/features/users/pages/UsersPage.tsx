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
  FilterBar,
  ActiveFilterChips,
  FilterDrawer,
  FilterSelect,
} from "@/components";
import { Plus, Users as UsersIcon, Shield, Utensils, UserCheck, SlidersHorizontal } from "lucide-react";
import { UserCard } from "../components";
import { ROUTES } from "@/app/routes";
import { usePermissions } from "@/hooks";
import { RoleName } from "@/types";
import { SidebarLayout } from "@/layouts/SidebarLayout";

/**
 * Premium Users Page
 * Redesigned with advanced filter system and launchpad consistency.
 */
export function UsersPage() {
  const navigate = useNavigate();
  const { isAdmin } = usePermissions();
  const { data: users, isLoading, error } = useUsers();

  // ============ STATE =============
  const [roleFilter, setRoleFilter] = useState<RoleName | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

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
    if (!users) return { all: 0, admin: 0, waiter: 0, kitchen: 0, cashier: 0 };

    const getRoleName = (user: any): string | null => {
      if (!user.roles || user.roles.length === 0) return null;
      const firstRole = user.roles[0];
      return "role" in firstRole ? firstRole.role.name : firstRole.name;
    };

    return {
      all: users.length,
      admin: users.filter((u) => getRoleName(u) === RoleName.ADMIN).length,
      waiter: users.filter((u) => getRoleName(u) === RoleName.WAITER).length,
      kitchen: users.filter((u) => getRoleName(u) === RoleName.KITCHEN_MANAGER).length,
      cashier: users.filter((u) => getRoleName(u) === RoleName.CASHIER).length,
    };
  }, [users]);

  const hasActiveFilters = roleFilter !== "ALL" || searchQuery !== "";

  const roleOptions = [
    { value: "ALL", label: "Todos", count: counts.all },
    { value: RoleName.ADMIN, label: "Admin", count: counts.admin },
    { value: RoleName.WAITER, label: "Mesero", count: counts.waiter },
    { value: RoleName.KITCHEN_MANAGER, label: "Cocina", count: counts.kitchen },
  ];

  const activeChips = [
    ...(roleFilter !== "ALL" ? [{ key: "role", label: "Rol", value: roleFilter }] : []),
    ...(searchQuery !== "" ? [{ key: "search", label: "Búsqueda", value: searchQuery }] : []),
  ];

  // ============= HANDLERS ===============
  const handleCreateUser = () => navigate(ROUTES.USER_CREATE);
  const handleEditUser = (userId: string) => navigate(`/users/${userId}/edit`);
  const handleClearFilters = () => {
    setRoleFilter("ALL");
    setSearchQuery("");
  };

  if (isLoading) {
    return (
      <SidebarLayout hideTitle fullWidth>
        <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} variant="card" height={80} />)}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <Skeleton key={i} variant="card" height={180} />)}
          </div>
        </div>
      </SidebarLayout>
    );
  }

  if (error) {
    return (
      <SidebarLayout hideTitle fullWidth>
        <div className="flex items-center justify-center min-h-[50vh] px-4 sm:px-6 lg:px-8 py-8">
          <Card variant="elevated" padding="lg" className="max-w-md w-full border border-sage-200 shadow-sm rounded-2xl">
            <div className="text-center">
              <div className="w-14 h-14 bg-rose-50 rounded-xl flex items-center justify-center mx-auto mb-4 text-rose-500">
                <UsersIcon className="w-7 h-7" />
              </div>
              <h2 className="text-lg font-semibold text-carbon-900 mb-2">Error al cargar usuarios</h2>
              <p className="text-carbon-500 text-sm mb-6">{error.message}</p>
              <Button variant="primary" size="lg" onClick={() => window.location.reload()} fullWidth className="min-h-[44px]">
                Reintentar
              </Button>
            </div>
          </Card>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout hideTitle fullWidth>
      <div className="px-4 sm:px-6 lg:px-8 space-y-8 pb-24 py-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-sage-600">
              <UsersIcon className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Recursos Humanos</span>
            </div>
            <h1 className="text-3xl font-bold text-carbon-900 tracking-tight">Gestión de Equipo</h1>
            <p className="text-sm text-carbon-500 font-medium">Administra el personal, roles y accesos del sistema.</p>
          </div>
          
          {isAdmin() && (
            <Button
              size="lg"
              variant="primary"
              onClick={handleCreateUser}
              className="rounded-2xl h-14 px-8 shadow-soft-lg transition-all active:scale-95 font-bold bg-carbon-900 hover:bg-carbon-800"
            >
              <Plus className="w-5 h-5 mr-2 stroke-[3px]" />
              Nuevo Usuario
            </Button>
          )}
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-sage-100 p-4 shadow-soft-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sage-50 flex items-center justify-center text-sage-600">
                <UsersIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-carbon-400 uppercase tracking-widest leading-none mb-1">Total</p>
                <p className="text-xl font-bold text-carbon-900">{counts.all}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-sage-100 p-4 shadow-soft-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-carbon-400 uppercase tracking-widest leading-none mb-1">Admins</p>
                <p className="text-xl font-bold text-carbon-900">{counts.admin}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-sage-100 p-4 shadow-soft-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-carbon-400 uppercase tracking-widest leading-none mb-1">Meseros</p>
                <p className="text-xl font-bold text-carbon-900">{counts.waiter}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-sage-100 p-4 shadow-soft-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-carbon-400 uppercase tracking-widest leading-none mb-1">Cocina</p>
                <p className="text-xl font-bold text-carbon-900">{counts.kitchen}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Unified Filter System */}
        <div className="space-y-6">
          <FilterBar>
            <div className="flex flex-col lg:flex-row lg:items-center gap-6 flex-1 min-w-0">
              <div className="w-full lg:w-72 flex-shrink-0">
                <FilterSearch
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Nombre o email..."
                  onClear={() => setSearchQuery("")}
                />
              </div>
              
              <div className="flex-1 min-w-0 overflow-x-auto custom-scrollbar-hide">
                <FilterPills
                  options={roleOptions}
                  value={roleFilter}
                  onChange={(v) => setRoleFilter(v as RoleName | "ALL")}
                />
              </div>
            </div>

            <div className="flex-shrink-0">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsFilterDrawerOpen(true)}
                className="rounded-2xl h-12 px-6 border-sage-100 text-carbon-600 hover:border-sage-400 hover:text-carbon-900 transition-all font-bold group shadow-soft-sm bg-white"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2 text-carbon-400 group-hover:text-carbon-900 transition-colors" />
                Filtros
                {hasActiveFilters && (
                  <span className="ml-2 w-2 h-2 rounded-full bg-sage-500 animate-pulse" />
                )}
              </Button>
            </div>
          </FilterBar>

          <ActiveFilterChips
            chips={activeChips}
            resultCount={filteredUsers.length}
            resultLabel={filteredUsers.length === 1 ? "usuario" : "usuarios"}
            onClearFilter={(key) => {
              if (key === "role") setRoleFilter("ALL");
              if (key === "search") setSearchQuery("");
            }}
            onClearAll={handleClearFilters}
          />
        </div>

        {/* Users Grid */}
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
            icon={<UsersIcon className="w-12 h-12" />}
            title={hasActiveFilters ? "Sin coincidencias" : "No hay usuarios"}
            description={
              hasActiveFilters ? "Prueba ajustando los filtros de rol o la búsqueda." : "Comienza agregando personal a tu restaurante."
            }
            actionLabel={hasActiveFilters ? "Limpiar filtros" : "Nuevo Usuario"}
            onAction={hasActiveFilters ? handleClearFilters : handleCreateUser}
          />
        )}

        {/* Filter Drawer */}
        <FilterDrawer
          isOpen={isFilterDrawerOpen}
          onClose={() => setIsFilterDrawerOpen(false)}
          onApply={() => {}}
          onClear={handleClearFilters}
          isDirty={hasActiveFilters}
          title="Refinar Personal"
        >
          <div className="space-y-8">
            <FilterSelect
              label="Filtrar por Rol Específico"
              value={roleFilter}
              onChange={(v) => setRoleFilter(v as RoleName | "ALL")}
              options={[
                { value: "ALL", label: "Todos los roles" },
                { value: RoleName.ADMIN, label: "Administradores" },
                { value: RoleName.WAITER, label: "Meseros" },
                { value: RoleName.KITCHEN_MANAGER, label: "Jefes de Cocina" },
                { value: RoleName.CASHIER, label: "Cajeros" },
              ]}
              placeholder="Seleccionar rol..."
            />
            
            <div className="pt-4 p-5 rounded-2xl bg-sage-50 border border-sage-100">
              <h4 className="text-[10px] font-black text-carbon-400 uppercase tracking-widest mb-3 ml-1">Información</h4>
              <p className="text-sm font-medium text-carbon-600 leading-relaxed">
                Usa los filtros avanzados para gestionar los permisos y accesos de tu equipo de trabajo de forma eficiente.
              </p>
            </div>
          </div>
        </FilterDrawer>
      </div>
    </SidebarLayout>
  );
}