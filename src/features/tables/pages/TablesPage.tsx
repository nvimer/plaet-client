import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTables } from "../hooks";
import { useTableFilters } from "../hooks/useTableFilters";
import { Button, Card, FilterBar, FilterSearch, FilterPills, ActiveFilterChips, FilterDrawer, FilterSelect } from "@/components";
import { TableCard } from "../components";
import { Plus, Table as TableIcon, SlidersHorizontal } from "lucide-react";
import { ROUTES, getTableManageRoute } from "@/app/routes";
import { Skeleton } from "@/components/ui/Skeleton/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState/EmptyState";
import { TableStatus } from "@/types";
import { SidebarLayout } from "@/layouts/SidebarLayout";

const STATUS_LABELS: Record<string, string> = {
  ALL: "Todas",
  [TableStatus.AVAILABLE]: "Disponibles",
  [TableStatus.OCCUPIED]: "Ocupadas",
  [TableStatus.NEEDS_CLEANING]: "Limpieza",
};

/**
 * Premium Tables Page
 * Redesigned with advanced filter system and launchpad consistency.
 */
export function TablesPage() {
  const navigate = useNavigate();
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const { data, isLoading, error } = useTables();
  const tables = data?.tables;

  const {
    filters,
    filteredTables,
    counts,
    availableLocations,
    hasActiveFilters,
    activeFilterChips,
    updateFilter,
    clearFilters,
  } = useTableFilters(tables);

  const handleCreateTable = () => navigate(ROUTES.TABLE_CREATE);
  const handleManageTable = (id: number) => navigate(getTableManageRoute(id));

  const statusPillOptions = [
    { value: "ALL", label: "Todas", count: counts.all },
    { value: TableStatus.AVAILABLE, label: "Libres", count: counts.available },
    { value: TableStatus.OCCUPIED, label: "Ocupadas", count: counts.occupied },
  ];

  const locationOptions = [
    { value: "", label: "Todas las ubicaciones" },
    ...availableLocations.filter((loc): loc is string => Boolean(loc)).map((loc) => ({ value: loc, label: loc })),
  ];

  const chipsForBar = activeFilterChips.map((c) => ({
    key: c.key as string,
    label: c.key === "search" ? "Búsqueda" : c.key === "status" ? "Estado" : "Ubicación",
    value: c.key === "status" ? STATUS_LABELS[c.value] ?? c.value : c.value,
  }));

  if (isLoading) {
    return (
      <SidebarLayout hideTitle fullWidth>
        <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} variant="card" height={80} />
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} variant="card" />
            ))}
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
                <TableIcon className="w-7 h-7" />
              </div>
              <h2 className="text-lg font-semibold text-carbon-900 mb-2">Error al cargar mesas</h2>
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sage-600">
              <TableIcon className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Operación Local</span>
            </div>
            <h1 className="text-4xl font-bold text-carbon-900 tracking-tight">Estado de Mesas</h1>
            <p className="text-lg text-carbon-500 font-medium">Administra la ocupación y ubicación de las mesas en tiempo real.</p>
          </div>
          
          <Button 
            size="lg" 
            variant="primary" 
            onClick={handleCreateTable} 
            className="rounded-2xl h-14 px-8 shadow-soft-lg transition-all active:scale-95 font-bold bg-carbon-900 hover:bg-carbon-800"
          >
            <Plus className="w-5 h-5 mr-2 stroke-[3px]" />
            Nueva Mesa
          </Button>
        </header>

        {/* Unified Filter System */}
        <div className="space-y-6">
          <FilterBar>
            <div className="flex flex-col lg:flex-row lg:items-center gap-6 flex-1 min-w-0">
              <div className="w-full lg:w-72 flex-shrink-0">
                <FilterSearch
                  value={filters.search}
                  onChange={(v) => updateFilter("search", v)}
                  onClear={() => updateFilter("search", "")}
                  placeholder="Buscar mesa o área..."
                />
              </div>
              
              <div className="flex-1 min-w-0 overflow-x-auto custom-scrollbar-hide">
                <FilterPills
                  options={statusPillOptions}
                  value={filters.status}
                  onChange={(v) => updateFilter("status", v)}
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
            chips={chipsForBar}
            resultCount={filteredTables.length}
            resultLabel={filteredTables.length === 1 ? "mesa" : "mesas"}
            onClearFilter={(key) => {
              if (key === "search") updateFilter("search", "");
              else if (key === "status") updateFilter("status", "ALL");
              else if (key === "location") updateFilter("location", "");
            }}
            onClearAll={clearFilters}
          />
        </div>

        {/* Tables Grid */}
        {filteredTables.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTables.map((table) => (
              <TableCard key={table.id} table={table} onEdit={() => handleManageTable(table.id)} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<TableIcon className="w-12 h-12" />}
            title={hasActiveFilters ? "Sin resultados" : "No hay mesas"}
            description={
              hasActiveFilters ? "Prueba ajustando los filtros de búsqueda o ubicación." : "Comienza creando tu primera mesa."
            }
            actionLabel={hasActiveFilters ? "Limpiar filtros" : "Crear primera mesa"}
            onAction={hasActiveFilters ? clearFilters : handleCreateTable}
          />
        )}

        {/* Advanced Filter Drawer */}
        <FilterDrawer
          isOpen={isFilterDrawerOpen}
          onClose={() => setIsFilterDrawerOpen(false)}
          onApply={() => {}}
          onClear={clearFilters}
          isDirty={hasActiveFilters}
          title="Refinar Sala"
        >
          <div className="space-y-8">
            <FilterSelect
              label="Ubicación / Área"
              value={filters.location}
              onChange={(v) => updateFilter("location", v)}
              options={locationOptions}
              placeholder="Todas las áreas"
            />
            
            <div className="pt-4 p-5 rounded-2xl bg-sage-50 border border-sage-100">
              <h4 className="text-[10px] font-black text-carbon-400 uppercase tracking-widest mb-3 ml-1">Zonificación</h4>
              <p className="text-sm font-medium text-carbon-600 leading-relaxed">
                Filtra por salón, terraza o barra para gestionar mejor el flujo de clientes.
              </p>
            </div>
          </div>
        </FilterDrawer>
      </div>
    </SidebarLayout>
  );
}