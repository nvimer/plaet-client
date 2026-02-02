import { TableStatus, type Table } from "@/types";
import type { AxiosErrorWithResponse } from "@/types/common";
import { useUpdateTableStatus } from "../hooks";
import { useDeleteTable } from "../hooks/useDeleteTable";
import { Button } from "@/components";
import { MapPin, Edit2, Trash2, CircleCheck, CircleDot, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog/ConfirmDialog";
import { cn } from "@/utils/cn";

interface TableCardProps {
  table: Table;
  onEdit: () => void;
}

const STATUS_CONFIG = {
  [TableStatus.AVAILABLE]: {
    label: "Disponible",
    icon: CircleCheck,
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
    accent: "bg-emerald-500",
  },
  [TableStatus.OCCUPIED]: {
    label: "Ocupada",
    icon: CircleDot,
    bg: "bg-rose-50",
    border: "border-rose-200",
    text: "text-rose-700",
    badge: "bg-rose-100 text-rose-700 border-rose-200",
    accent: "bg-rose-500",
  },
  [TableStatus.NEEDS_CLEANING]: {
    label: "Limpieza",
    icon: Clock,
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    badge: "bg-amber-100 text-amber-700 border-amber-200",
    accent: "bg-amber-500",
  },
} as const;

/**
 * TableCard Component
 *
 * Modern card for a single table: clear hierarchy, status accent, quick actions.
 */
export function TableCard({ table, onEdit }: TableCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateTableStatus();
  const { mutate: deleteTable, isPending: isDeleting } = useDeleteTable();

  const config = STATUS_CONFIG[table.status];
  const StatusIcon = config.icon;

  const handleStatusChange = (newStatus: TableStatus) => {
    updateStatus(
      { id: table.id, status: newStatus },
      {
        onSuccess: () => {
          const labels: Record<TableStatus, string> = {
            [TableStatus.AVAILABLE]: "disponible",
            [TableStatus.OCCUPIED]: "ocupada",
            [TableStatus.NEEDS_CLEANING]: "en limpieza",
          };
          toast.success("Estado actualizado", {
            description: `Mesa ${table.number} ahora está ${labels[newStatus]}`,
          });
        },
        onError: (error: AxiosErrorWithResponse) => {
          toast.error("Error al actualizar", {
            description: error.response?.data?.message || error.message,
          });
        },
      }
    );
  };

  const handleDelete = () => {
    deleteTable(table.id, {
      onSuccess: () => {
        toast.success("Mesa eliminada", { description: `Mesa ${table.number} eliminada` });
      },
      onError: (error: AxiosErrorWithResponse) => {
        toast.error("Error al eliminar", {
          description: error.response?.data?.message || error.message,
        });
      },
    });
  };

  return (
    <>
      <article
        className={cn(
          "group relative overflow-hidden",
          "bg-white rounded-2xl border-2 shadow-sm",
          "transition-all duration-200",
          "hover:shadow-md hover:border-sage-200",
          config.border
        )}
      >
        {/* Status accent bar */}
        <div className={cn("h-1 w-full", config.accent)} aria-hidden />

        <div className="p-5 sm:p-6">
          {/* Header: number + location + status */}
          <div className="flex items-start justify-between gap-4 mb-5">
            <div className="min-w-0 flex-1">
              <div
                className={cn(
                  "w-14 h-14 rounded-xl flex items-center justify-center mb-3",
                  config.bg,
                  "border border-current/10"
                )}
              >
                <span
                  className={cn(
                    "text-2xl font-bold tracking-tight",
                    config.text
                  )}
                >
                  {table.number}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-carbon-900 truncate">
                Mesa {table.number}
              </h3>
              {table.location && (
                <div className="flex items-center gap-1.5 mt-1 text-carbon-500">
                  <MapPin className="w-4 h-4 flex-shrink-0 text-carbon-400" />
                  <span className="text-sm truncate">{table.location}</span>
                </div>
              )}
            </div>
            <div className="flex-shrink-0">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full",
                  "text-xs font-medium border",
                  config.badge
                )}
              >
                <StatusIcon className="w-3.5 h-3.5" />
                {config.label}
              </span>
            </div>
          </div>

          {/* Quick status change */}
          <div className="mb-5">
            <p className="text-xs font-medium text-carbon-500 mb-2">
              Cambiar estado
            </p>
            <div className="flex flex-wrap gap-2">
              {table.status !== TableStatus.AVAILABLE && (
                <button
                  type="button"
                  onClick={() => handleStatusChange(TableStatus.AVAILABLE)}
                  disabled={isUpdatingStatus}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg",
                    "text-xs font-medium border transition-colors",
                    "bg-emerald-50 border-emerald-200 text-emerald-700",
                    "hover:bg-emerald-100 disabled:opacity-50"
                  )}
                >
                  <CircleCheck className="w-3.5 h-3.5" />
                  Disponible
                </button>
              )}
              {table.status !== TableStatus.OCCUPIED && (
                <button
                  type="button"
                  onClick={() => handleStatusChange(TableStatus.OCCUPIED)}
                  disabled={isUpdatingStatus}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg",
                    "text-xs font-medium border transition-colors",
                    "bg-rose-50 border-rose-200 text-rose-700",
                    "hover:bg-rose-100 disabled:opacity-50"
                  )}
                >
                  <CircleDot className="w-3.5 h-3.5" />
                  Ocupada
                </button>
              )}
              {table.status !== TableStatus.NEEDS_CLEANING && (
                <button
                  type="button"
                  onClick={() => handleStatusChange(TableStatus.NEEDS_CLEANING)}
                  disabled={isUpdatingStatus}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg",
                    "text-xs font-medium border transition-colors",
                    "bg-amber-50 border-amber-200 text-amber-700",
                    "hover:bg-amber-100 disabled:opacity-50"
                  )}
                >
                  <Clock className="w-3.5 h-3.5" />
                  Limpieza
                </button>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t border-sage-100">
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="flex-1 min-h-[40px]"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Gestionar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDeleteDialogOpen(true)}
              disabled={isDeleting}
              className="flex-1 min-h-[40px] text-rose-600 hover:bg-rose-50 hover:text-rose-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar
            </Button>
          </div>
        </div>
      </article>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Eliminar mesa"
        message={`¿Eliminar la mesa ${table.number}? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        isLoading={isDeleting}
      />
    </>
  );
}
