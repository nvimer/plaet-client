import { useNavigate } from "react-router-dom";
import { useTables } from "../hooks";
import { useTableFilters } from "../hooks/useTableFilters";
import { Button, Card, FilterBar, FilterSearch, FilterPills, ActiveFilterChips } from "@/components";
import { TableCard } from "../components";
import { Plus, Table as TableIcon } from "lucide-react";
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
 * TablesPage – Gestión de mesas con filtros unificados (mismo diseño que menú).
 */
export function TablesPage() {
  const navigate = useNavigate();

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
    { value: TableStatus.AVAILABLE, label: "Disponibles", count: counts.available },
    { value: TableStatus.OCCUPIED, label: "Ocupadas", count: counts.occupied },
    { value: TableStatus.NEEDS_CLEANING, label: "Limpieza", count: counts.cleaning },
  ];

  const locationPillOptions = [
    { value: "", label: "Todas" },
    ...availableLocations.filter((loc): loc is string => Boolean(loc)).map((loc) => ({ value: loc, label: loc })),
  ];

  const chipsForBar = activeFilterChips.map((c) => ({
    key: c.key as string,
    label: c.key === "search" ? "Búsqueda" : c.key === "status" ? "Estado" : "Ubicación",
    value: c.key === "status" ? STATUS_LABELS[c.value] ?? c.value : c.value,
  }));

  if (isLoading) {
    return (
      <>
        <div className="mb-8">
          <Skeleton variant="text" width={240} height={32} className="mb-2" />
          <Skeleton variant="text" width={320} height={20} />
        </div>
        <Skeleton variant="card" height={56} className="mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} variant="card" />
          ))}
        </div>
      </>
    );
  }

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
    );
  }

  return (
    <SidebarLayout hideHeader fullWidth>
      <div className="px-4 sm:px-6 lg:px-8 space-y-8 pb-24">
      {/* ============ PAGE HEADER =============== */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-sage-600">
            <TableIcon className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Operación Local</span>
          </div>
          <h1 className="text-3xl font-bold text-carbon-900 tracking-tight">Gestión de Mesas</h1>
          <p className="text-sm text-carbon-500 font-medium">Administra la ocupación y ubicación de las mesas en tiempo real.</p>
        </div>
        
        <Button 
          size="lg" 
          variant="primary" 
          onClick={handleCreateTable} 
          className="rounded-2xl h-14 px-8 shadow-soft-lg transition-all active:scale-95 font-bold"
        >
          <Plus className="w-5 h-5 mr-2 stroke-[3px]" />
          Nueva Mesa
        </Button>
      </header>

      <div className="space-y-4 mb-6">
        <FilterBar>
          <div className="flex flex-wrap items-end gap-4 [&>div]:min-w-0">
            <div className="w-full sm:max-w-[280px] flex-shrink-0 basis-full sm:basis-auto">
              <FilterSearch
                value={filters.search}
                onChange={(v) => updateFilter("search", v)}
                onClear={() => updateFilter("search", "")}
                placeholder="Buscar por número o ubicación..."
                aria-label="Buscar mesas"
              />
            </div>
            <div className="flex-shrink-0 w-full sm:w-auto min-w-0">
              <FilterPills
                label="Estado"
                options={statusPillOptions}
                value={filters.status}
                onChange={(v) => updateFilter("status", v)}
                aria-label="Filtrar por estado"
              />
            </div>
            {locationPillOptions.length > 1 && (
              <div className="flex-shrink-0 w-full sm:w-auto min-w-0">
                <FilterPills
                  label="Ubicación"
                  options={locationPillOptions}
                  value={filters.location}
                  onChange={(v) => updateFilter("location", v)}
                  aria-label="Filtrar por ubicación"
                />
              </div>
            )}
          </div>
        </FilterBar>

        {hasActiveFilters && (
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
        )}
      </div>

      <p className="text-sm font-medium text-carbon-600 mb-5">
        {filteredTables.length} {filteredTables.length === 1 ? "mesa" : "mesas"}
        {hasActiveFilters && " encontradas"}
      </p>

      {filteredTables.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTables.map((table) => (
            <TableCard key={table.id} table={table} onEdit={() => handleManageTable(table.id)} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<TableIcon />}
          title={hasActiveFilters ? "No hay mesas que coincidan con tus filtros" : "No hay mesas"}
          description={
            hasActiveFilters ? "Ajusta los filtros para ver más resultados" : "Crea tu primera mesa para comenzar"
          }
          actionLabel={!hasActiveFilters ? "Crear primera mesa" : undefined}
          onAction={!hasActiveFilters ? handleCreateTable : undefined}
                  />
                        )}
                      </div>
                    </SidebarLayout>
                  );
                }
                
