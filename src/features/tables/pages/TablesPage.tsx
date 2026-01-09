import { useState } from "react";
import { useTables } from "../hooks";
import { TableStatus, type Table } from "@/types";
import { Button, Card } from "@/components";
import { TableCard, TableForm } from "../components";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { Filter, Plus, Table as TableIcon } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

/**
 * TablesPage Component
 * Main page for table management (CRUD operations)
 */
export function TablesPage() {
    // ============= STATE ===============
    const { data: tables, isLoading, error } = useTables();
    const [showForm, setShowForm] = useState(false);
    const [editingTable, setEditingTable] = useState<Table | undefined>();
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
    // Handle edit button click
    const handleEdit = (table: Table) => {
        setEditingTable(table);
        setShowForm(true);
    };

    // Handle form close (success or cancel)
    const handleFormClose = () => {
        setShowForm(false);
        setEditingTable(undefined);
    };

    // =============== LOADING STATE =============
    if (isLoading) {
        return (
            <DashboardLayout>
                {/* =========== PAGE HEADER SKELETON ============== */}
                <div className="mb-12">
                    {/* Title skeleton  */}
                    <Skeleton className="w-64 h-10 mb-3 bg-sage-100" />
                    <Skeleton className="w-96 h-6 bg-sage-100" />
                </div>

                <Skeleton className="w-full h-16 mb-8 bg-sage-100" />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="w-full h-48" />
                    ))}
                </div>
            </DashboardLayout>
        );
    }

    // ========== ERROR STATE ========
    if (error) {
        return (
            <DashboardLayout>
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
            </DashboardLayout>
        );
    }

    // ======== MAIN RENDER ========
    return (
        <DashboardLayout>
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
                    variant={showForm ? "ghost" : "primary"}
                    onClick={() => {
                        setShowForm(!showForm);
                        if (showForm) setEditingTable(undefined);
                    }}
                >
                    {showForm ? (
                        "Cancelar"
                    ) : (
                        <>
                            <Plus className="w-5 h-5 mr-2" />
                            Nueva Mesa
                        </>
                    )}
                </Button>
            </div>

            {/* ========== TABLE FORM ==============*/}
            {/*Conditional form display */}
            {showForm && (
                <TableForm
                    table={editingTable}
                    onSuccess={handleFormClose}
                    onCancel={handleFormClose}
                />
            )}

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
                        <button
                            onClick={() => setStatusFilter("ALL")}
                            className={`px-4 py-2 rounded-xl transition-all font-medium text-sm ${statusFilter === "ALL" ? "bg-carbon-900 text-white shadow-soft-md" : "bg-sage-50 text-carbon-600 hover:bg-sage-100"}`}
                        >
                            Todas{" "}
                            <Badge size="sm" variant="neutral" className="ml-2">
                                {counts.all}
                            </Badge>
                        </button>

                        {/* Available Tables */}
                        <button
                            onClick={() => setStatusFilter(TableStatus.AVAILABLE)}
                            className={`px-4 py-2 rounded-xl transition-all font-medium text-sm ${statusFilter === TableStatus.AVAILABLE ? "bg-sage-green-500 text-white shadow-soft-md" : "bg-sage-50 text-carbon-600 hover:bg-sage-100"}`}
                        >
                            Disponibles{" "}
                            <Badge
                                size="sm"
                                variant="success"
                                className="ml-2 text-sage-green-600"
                            >
                                {counts.available}
                            </Badge>
                        </button>

                        {/* occupied Tables */}
                        <button
                            onClick={() => setStatusFilter(TableStatus.OCCUPIED)}
                            className={`px-4 py-2 rounded-xl transition-all font-medium text-sm ${statusFilter === TableStatus.OCCUPIED ? "bg-red-500 text-white shadow-soft-md" : "bg-sage-50 text-carbon-600 hover:bg-sage-100"}`}
                        >
                            Ocupadas{" "}
                            <Badge size="sm" variant="error" className="ml-2">
                                {counts.occupied}
                            </Badge>
                        </button>

                        {/* Cleaning Tables */}
                        <button
                            onClick={() => setStatusFilter(TableStatus.NEEDS_CLEANING)}
                            className={`px-4 py-2 rounded-xl transition-all font-medium text-sm ${statusFilter === TableStatus.NEEDS_CLEANING ? "bg-yellow-500 text-white shadow-smooth" : "bg-sage-50 text-carbon-600 hover:bg-neutral-100"}`}
                        >
                            Limpieza{" "}
                            <Badge size="sm" variant="warning" className="ml-2">
                                {counts.cleaning}
                            </Badge>
                        </button>
                    </div>
                </div>
            </Card>

            {/* ============ TABLES GRID ========= */}
            {filteredTables && filteredTables.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredTables.map((table) => (
                        <TableCard key={table.id} table={table} onEdit={handleEdit} />
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
                        statusFilter === "ALL" ? () => setShowForm(true) : undefined
                    }
                />
            )}
        </DashboardLayout>
    );
}
