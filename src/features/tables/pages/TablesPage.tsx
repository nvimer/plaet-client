import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTables } from "../hooks";
import { TableStatus } from "@/types";
import { Button, Card } from "@/components";
import { TableCard } from "../components";
import { Filter, Plus, Table as TableIcon } from "lucide-react";
import { ROUTES, getTableManageRoute } from "@/app/routes";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

/**
 * TablesPage Component
 * Main page for table management (CRUD operations)
 */
export function TablesPage() {
    const navigate = useNavigate();
    // ============= STATE ===============
    const { data: tables, isLoading, error } = useTables();
    const [statusFilter, setStatusFilter] = useState<TableStatus | "ALL">("ALL");

    // ============ COMPUTED VALUES =============
    // Filter tables by selected status
    const filteredTables = tables?.filter((table) => {
        if (statusFilter === "ALL") return true;
        return table.status === statusFilter;
    });

    // Calculate counts for each status
    const counts = {
        all: tables?.length || 0,
        available:
            tables?.filter((t) => t.status === TableStatus.AVAILABLE).length || 0,
        occupied:
            tables?.filter((t) => t.status === TableStatus.OCCUPIED).length || 0,
        cleaning:
            tables?.filter((t) => t.status === TableStatus.NEEDS_CLEANING).length ||
            0,
    };

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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                        <div className=" text-center">
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
                    <h1 className="text-4xl font-semibold text-carbon-900 tracking-tight">
                        Gestión de Mesas
                    </h1>
                    <p className="text-[15px] text-neutral-600 font-light">
                        Administra las mesas del restaurante
                    </p>
                </div>

                {/* New Table Button  */}
                <Button
                    size="lg"
                    variant="primary"
                    onClick={handleCreateTable}
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Nueva Mesa
                </Button>
            </div>

            {/* ========== STATUS FILTER ============ */}
            <Card variant="elevated" padding="lg" className="mb-8">
                <div className="flex items-center gap-6">
                    {/* Filter Icon and Label */}
                    <div className="flex items-center gap-2 text-carbon-700 font-medium">
                        <Filter className="w-5 h-5" />
                        <span>Filtrar:</span>
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex flex-wrap gap-3">
                        {/* All Tables  */}
                        <Button
                            variant={statusFilter === "ALL" ? "primary" : "ghost"}
                            size="sm"
                            onClick={() => setStatusFilter("ALL")}
                            className={statusFilter === "ALL" ? "bg-carbon-900 hover:bg-carbon-800" : ""}
                        >
                            Todas{" "}
                            <Badge size="sm" variant="neutral" className="ml-2">
                                {counts.all}
                            </Badge>
                        </Button>

                        {/* Available Tables */}
                        <Button
                            variant={statusFilter === TableStatus.AVAILABLE ? "primary" : "ghost"}
                            size="sm"
                            onClick={() => setStatusFilter(TableStatus.AVAILABLE)}
                            className={statusFilter === TableStatus.AVAILABLE ? "bg-sage-green-500 hover:bg-sage-green-600" : ""}
                        >
                            Disponibles{" "}
                            <Badge
                                size="sm"
                                variant="success"
                                className="ml-2 text-sage-green-600"
                            >
                                {counts.available}
                            </Badge>
                        </Button>

                        {/* occupied Tables */}
                        <Button
                            variant={statusFilter === TableStatus.OCCUPIED ? "primary" : "ghost"}
                            size="sm"
                            onClick={() => setStatusFilter(TableStatus.OCCUPIED)}
                            className={statusFilter === TableStatus.OCCUPIED ? "bg-red-500 hover:bg-red-600 text-white" : ""}
                        >
                            Ocupadas{" "}
                            <Badge size="sm" variant="error" className="ml-2">
                                {counts.occupied}
                            </Badge>
                        </Button>

                        {/* Cleaning Tables */}
                        <Button
                            variant={statusFilter === TableStatus.NEEDS_CLEANING ? "primary" : "ghost"}
                            size="sm"
                            onClick={() => setStatusFilter(TableStatus.NEEDS_CLEANING)}
                            className={statusFilter === TableStatus.NEEDS_CLEANING ? "bg-yellow-500 hover:bg-yellow-600 text-white" : ""}
                        >
                            Limpieza{" "}
                            <Badge size="sm" variant="warning" className="ml-2">
                                {counts.cleaning}
                            </Badge>
                        </Button>
                    </div>
                </div>
            </Card>

            {/* ============ TABLES GRID ========= */}
            {filteredTables && filteredTables.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredTables.map((table) => (
                        <TableCard key={table.id} table={table} onEdit={() => handleManageTable(table.id)} />
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon={<TableIcon />}
                    title={
                        statusFilter === "ALL"
                            ? "No hay mesas"
                            : "No hay mesas con este estado"
                    }
                    description={
                        statusFilter === "ALL"
                            ? "Crea tu primera mesa para comenzar a gestionar tu restaurante"
                            : "Cambia el filtro para ver otras mesas"
                    }
                    actionLabel={
                        statusFilter === "ALL" ? "Crear Primera Mesa" : undefined
                    }
                    onAction={
                        statusFilter === "ALL" ? handleCreateTable : undefined
                    }
                />
            )}
        </>
    );
}
