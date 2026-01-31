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
    const { data: tables, isLoading, error } = useTables();
    
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

    // =============== LOADING STATE =============
    if (isLoading) {
        return (
            <>
                {/* =========== PAGE HEADER SKELETON ============== */}
                <div className="mb-12">
                    {/* Title skeleton  */}
                    <Skeleton variant="text" width={256} height={40} className="mb-3" />
                    <Skeleton variant="text" width={384} height={24} />
                </div>

                <Skeleton variant="card" height={64} className="mb-8" />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
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
            {/* ======== PAGE HEADER ======= */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-semibold text-carbon-900 tracking-tight">
                        Gestión de Mesas
                    </h1>
                    <p className="text-sm text-neutral-600 font-light">
                        Administra las mesas del restaurante eficientemente
                    </p>
                </div>

                {/* New Table Button  */}
                <Button size="lg" variant="primary" onClick={handleCreateTable}>
                    <Plus className="w-5 h-5 mr-2" />
                    Nueva Mesa
                </Button>
            </div>

            {/* ========== FILTER PANEL ============ */}
            <AdaptiveFilterPanel
                filters={filters}
                onFilterChange={updateFilter}
                counts={counts}
                availableLocations={availableLocations.filter((loc): loc is string => Boolean(loc))}
                className="mb-6"
            />

            {/* ========== ACTIVE FILTER CHIPS ============ */}
            {hasActiveFilters && (
                <div className="mb-8">
                    <FilterChips
                        filters={activeFilterChips}
                        resultCount={filteredTables.length}
                        onClearFilter={(key) => {
                            if (key === 'search') updateFilter('search', '');
                            else if (key === 'status') updateFilter('status', 'ALL');
                            else if (key === 'location') updateFilter('location', '');
                        }}
                        onClearAll={clearFilters}
                    />
                </div>
            )}

            {/* ============ RESULTS HEADER ========= */}
            <div className="mb-8">
                <h2 className="text-lg font-semibold text-carbon-900">
                    {filteredTables.length} {filteredTables.length === 1 ? 'Mesa' : 'Mesas'}
                    {hasActiveFilters && ' Encontradas'}
                </h2>
            </div>

            {/* ============ TABLES GRID ========= */}
            {filteredTables && filteredTables.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
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