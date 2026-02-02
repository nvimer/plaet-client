import { useNavigate } from "react-router-dom";
import { useTables } from "../hooks";
import { useTableFilters } from "../hooks/useTableFilters";
import { Button, Card } from "@/components";
import { TableCard, AdaptiveFilterPanel, FilterChips } from "../components";
import { Plus, Table as TableIcon } from "lucide-react";
import { ROUTES, getTableManageRoute } from "@/app/routes";
import { Skeleton } from "@/components/ui/Skeleton/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState/EmptyState";

/**
 * TablesPage Component
 * Main page for table management with advanced filtering capabilities
 */
export function TablesPage() {
    const navigate = useNavigate();
    
    // ============= DATA HOOKS ===============
    const { data, isLoading, error } = useTables();
    const tables = data?.tables;
    const meta = data?.meta;
    
    // ============= FILTER HOOK ===============
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

    // ================= EVENT HANDLERS =====================
    const handleCreateTable = () => {
        navigate(ROUTES.TABLE_CREATE);
    };

    const handleManageTable = (tableId: number) => {
        navigate(getTableManageRoute(tableId));
    };

    // Loading state
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

    // ========== ERROR STATE ========
    if (error) {
        return (
            <>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Card variant="elevated" padding="lg" className="max-w-md">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">⚠️</span>
                            </div>
                            <h2 className="text-xl font-semibold text-red-600 mb-2">
                                Error al cargar mesas
                            </h2>
                            <p className="text-carbon-600 mb-6 font-light">{error.message}</p>
                            <Button
                                variant="primary"
                                onClick={() => window.location.reload()}
                                fullWidth
                            >
                                Reintentar
                            </Button>
                        </div>
                    </Card>
                </div>
            </>
        );
    }

    // ======== MAIN RENDER ========
    return (
        <>
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-semibold text-carbon-900 tracking-tight">
                        Gestión de Mesas
                    </h1>
                    <p className="text-sm text-carbon-500 mt-1">
                        Administra las mesas del restaurante
                    </p>
                </div>
                <Button
                    size="lg"
                    variant="primary"
                    onClick={handleCreateTable}
                    className="w-full sm:w-auto min-h-[44px]"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Nueva Mesa
                </Button>
            </div>

            {/* Filter Panel */}
            <AdaptiveFilterPanel
                filters={filters}
                onFilterChange={updateFilter}
                counts={counts}
                availableLocations={availableLocations.filter((loc): loc is string => Boolean(loc))}
                className="mb-6"
            />

            {/* Active Filter Chips */}
            {hasActiveFilters && (
                <div className="mb-6">
                    <FilterChips
                        filters={activeFilterChips}
                        resultCount={filteredTables.length}
                        onClearFilter={(key) => {
                            if (key === "search") updateFilter("search", "");
                            else if (key === "status") updateFilter("status", "ALL");
                            else if (key === "location") updateFilter("location", "");
                        }}
                        onClearAll={clearFilters}
                    />
                </div>
            )}

            {/* Results */}
            <div className="mb-4">
                <p className="text-sm font-medium text-carbon-600">
                    {filteredTables.length}{" "}
                    {filteredTables.length === 1 ? "mesa" : "mesas"}
                    {hasActiveFilters && " encontradas"}
                </p>
            </div>

            {/* Tables Grid */}
            {filteredTables && filteredTables.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredTables.map((table) => (
                        <TableCard
                            key={table.id}
                            table={table}
                            onEdit={() => handleManageTable(table.id)}
                        />
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon={<TableIcon />}
                    title={
                        hasActiveFilters
                            ? "No hay mesas que coincidan con tus filtros"
                            : "No hay mesas"
                    }
                    description={
                        hasActiveFilters
                            ? "Intenta ajustar tus filtros para ver más resultados"
                            : "Crea tu primera mesa para comenzar a gestionar tu restaurante"
                    }
                    actionLabel={
                        !hasActiveFilters ? "Crear Primera Mesa" : undefined
                    }
                    onAction={
                        !hasActiveFilters ? handleCreateTable : undefined
                    }
                />
            )}
        </>
    );
}