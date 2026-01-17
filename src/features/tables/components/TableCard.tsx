import { TableStatus, type Table } from "@/types";
import type { AxiosErrorWithResponse } from "@/types/common";
import { useUpdateTableStatus } from "../hooks";
import { useDeleteTable } from "../hooks/useDeleteTable";
import { Button, Card } from "@/components";
import { MapPin, Edit2, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

// ==================== TYPES / TIPOS ====================
interface TableCardProps {
    table: Table;
    onEdit: () => void;
}

/**
 * TableCard Component
 *
 * Displays a single table with status and actions
 *
 * Features / Caracter?sticas:
 * - Visual table representation
 * - Status badge with colors
 * - Quick status change buttons
 * - Edit and delete actions
 */
export function TableCard({ table, onEdit }: TableCardProps) {
    // ================ STATE ===============
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    // ==================== HOOKS ====================
    const { mutate: updateStatus, isPending: isUpdatingStatus } =
        useUpdateTableStatus();
    const { mutate: deleteTable, isPending: isDeleting } = useDeleteTable();

    // ==================== EVENT HANDLERS ====================
    // Handle status change
    const handleStatusChange = (newStatus: TableStatus) => {
        updateStatus(
            { id: table.id, status: newStatus },
            {
                onSuccess: () => {
                    toast.success("Estado actualizado", {
                        description: `La mesa #${table.number} ahora está ${newStatus === TableStatus.AVAILABLE
                                ? "disponible"
                                : newStatus === TableStatus.OCCUPIED
                                    ? "ocupada"
                                    : "en limpieza"
                            }`,
                        icon: "✅",
                    });
                },
                onError: (error: AxiosErrorWithResponse) => {
                    toast.error("Error al actualizar el estado", {
                        description: error.response?.data?.message || error.message,
                        icon: "❌",
                    });
                },
            },
        );
    };

    // Handle delete with confirmation
    const handleDelete = () => {
        deleteTable(table.id, {
            onSuccess: () => {
                toast.success("Mesa eliminada", {
                    description: `La mesa #${table.number} ha sido eliminada`,
                    icon: "🗑️",
                });
            },
            onError: (error: AxiosErrorWithResponse) => {
                toast.error("Error al eliminar mesa", {
                    description: error.response?.data?.message || error.message,
                    icon: "❌",
                });
            },
        });
    };

    // ==================== STATUS VARIANTS  ====================
    // Map table status to badge variant
    const statusConfig = {
        [TableStatus.AVAILABLE]: {
            variant: "success" as const,
            label: "Disponible",
            borderColor: "border-sage-green-300",
            bgColor: "bg-sage-green-50",
            iconBg: "bg-sage-green-100",
            iconText: "text-sage-green-700",
        },
        [TableStatus.OCCUPIED]: {
            variant: "error" as const,
            label: "Ocupada",
            borderColor: "border-red-300",
            bgColor: "bg-red-50",
            iconBg: "bg-red-100",
            iconText: "text-red-700",
        },
        [TableStatus.NEEDS_CLEANING]: {
            variant: "warning" as const,
            label: "Limpieza",
            borderColor: "border-yellow-300",
            bgColor: "bg-yellow-50",
            iconBg: "bg-yellow-100",
            iconText: "text-yellow-700",
        },
    };

    const currentStatus = statusConfig[table.status];

    // ==================== RENDER ====================
    return (
        <>
            <Card
                variant="elevated"
                padding="lg"
                className={`transition-all duration-300 hover:shadow-soft-xl border-2 ${currentStatus.borderColor} hover:-translate-y-1`}
            >
                {/* ==================== HEADER ==================== */}
                <div className="flex items-start justify-between mb-6">
                    {/* Table Number Display */}
                    <div className="flex items-center gap-4">
                        {/* Large table number icon */}
                        <div
                            className={`w-16 h-16 ${currentStatus.iconBg} rounded-2xl flex items-center justify-center border-2 ${currentStatus.borderColor}`}
                        >
                            <span className={`text-2xl font-bold ${currentStatus.iconText}"`}>
                                {table.number}
                            </span>
                        </div>

                        {/* Table info */}
                        <div>
                            <h3 className="text-xl font-semibold text-carbon-900 mb-1">
                                Mesa {table.number}
                            </h3>
                            {/* Location with icon  */}
                            {table.location && (
                                <div className="flex items-center gap-1.5 text-carbon-600">
                                    <MapPin className="w-4 h-4" />
                                    <span className="text-sm font-light">{table.location}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Status Badge */}
                    <Badge variant={currentStatus.variant} size="md">
                        {currentStatus.label}
                    </Badge>
                </div>

                {/* ==================== QUICK STATUS ACTIONS  ==================== */}
                <div className="mb-6">
                    <p className="text-sm font-medium text-carbon-700 mb-3">
                        Cambiar estado:
                    </p>

                    {/* Status change buttons grid */}
                    <div className="grid grid-cols-3 gap-2">
                        {/* Available Button */}
                        {table.status !== TableStatus.AVAILABLE && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusChange(TableStatus.AVAILABLE)}
                                disabled={isUpdatingStatus}
                                className="text-sage-green-700 border-sage-green-300 hover:bg-sage-green-50"
                            >
                                Disponible
                            </Button>
                        )}

                        {/* Occupied Button */}
                        {table.status !== TableStatus.OCCUPIED && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusChange(TableStatus.OCCUPIED)}
                                disabled={isUpdatingStatus}
                                className="text-red-700 border-red-300 hover:bg-red-50"
                            >
                                Ocupada
                            </Button>
                        )}

                        {/* Cleaning Button  */}
                        {table.status !== TableStatus.NEEDS_CLEANING && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusChange(TableStatus.NEEDS_CLEANING)}
                                disabled={isUpdatingStatus}
                                className="text-yellow-700 border-yellow-300 hover:bg-yellow-50"
                            >
                                Limpieza
                            </Button>
                        )}
                    </div>
                </div>

                {/* ==================== MAIN ACTIONS ==================== */}
                <div className="flex gap-3 pt-6 border-t border-sage-border-subtle">
                    {/* Edit Button */}
                    <Button
                        variant="ghost"
                        size="md"
                        onClick={onEdit}
                        className="flex-1 group"
                    >
                        <Edit2 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                        Editar
                    </Button>

                    {/* Delete Button */}
                    <Button
                        variant="ghost"
                        size="md"
                        onClick={() => setIsDeleteDialogOpen(true)}
                        disabled={isDeleting}
                        isLoading={isDeleting}
                        className="flex-1 text-red-600 hover:bg-red-50 hover:text-red-700 group"
                    >
                        {!isDeleting && (
                            <Trash2 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                        )}
                        Eliminar
                    </Button>
                </div>
            </Card>
            {/* // =============== CONFIRM DIALOG ================== */}
            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDelete}
                title="Eliminar Mesa"
                message={`¿Estás seguro de que deseas eliminar la mesa #${table.number}? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                cancelText="Cancelar"
                variant="danger"
                isLoading={isDeleting}
            />
        </>
    );
}
