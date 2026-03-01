import { TableStatus, type Table } from "@/types";
import type { AxiosErrorWithResponse } from "@/types/common";
import { useUpdateTableStatus } from "../hooks";
import { useDeleteTable } from "../hooks/useDeleteTable";
import { Button, Badge } from "@/components";
import { Edit2, Trash2, CircleCheck, CircleDot, Clock, Users, Timer } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog/ConfirmDialog";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";

interface TableCardProps {
  table: Table;
  onEdit: () => void;
}

const STATUS_MAP = {
  [TableStatus.AVAILABLE]: {
    label: "Disponible",
    icon: CircleCheck,
    color: "text-success-600",
    bg: "bg-success-50/30",
    border: "border-success-100",
    dot: "bg-success-500",
  },
  [TableStatus.OCCUPIED]: {
    label: "Ocupada",
    icon: CircleDot,
    color: "text-rose-600",
    bg: "bg-rose-50/30",
    border: "border-rose-100",
    dot: "bg-rose-500",
  },
  [TableStatus.NEEDS_CLEANING]: {
    label: "En Limpieza",
    icon: Clock,
    color: "text-amber-600",
    bg: "bg-amber-50/30",
    border: "border-amber-100",
    dot: "bg-amber-500",
  },
} as const;

/**
 * Premium Table Card - Minimalist Edition
 * Focused on clarity, fast reading and tactile efficiency.
 */
export function TableCard({ table, onEdit }: TableCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateTableStatus();
  const { mutate: deleteTable, isPending: isDeleting } = useDeleteTable();

  const theme = STATUS_MAP[table.status];
  const StatusIcon = theme.icon;

  const handleStatusChange = (newStatus: TableStatus) => {
    updateStatus(
      { id: table.id, status: newStatus },
      {
        onSuccess: () => {
          toast.success(`Mesa ${table.number} actualizada`);
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
      onSuccess: () => toast.success("Mesa eliminada"),
      onError: (error: AxiosErrorWithResponse) => toast.error("Error al eliminar"),
    });
  };

  return (
    <>
      <motion.article
        whileHover={{ y: -2 }}
        className={cn(
          "relative group bg-white rounded-3xl border-2 transition-all duration-300",
          "p-5 flex flex-col justify-between min-h-[220px]",
          theme.bg, theme.border,
          "hover:shadow-smooth-lg hover:border-carbon-200"
        )}
      >
        {/* Top Info: Status Badge & Capacity */}
        <div className="flex items-center justify-between mb-2">
          <div className={cn(
            "flex items-center gap-1.5 px-3 py-1 rounded-full border bg-white shadow-soft-xs",
            theme.color, theme.border
          )}>
            <StatusIcon className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase tracking-widest">{theme.label}</span>
          </div>
          
          <div className="flex items-center gap-1.5 text-carbon-400 bg-white/50 px-2.5 py-1 rounded-full border border-sage-100">
            <Users className="w-3 h-3" />
            <span className="text-[10px] font-bold">{table.seats || 4}</span>
          </div>
        </div>

        {/* Center: Table Number & Location - FIXED HEIGHT */}
        <div className="flex-1 flex flex-col items-center justify-center py-2 min-h-[120px]">
          <h2 className="text-5xl font-black text-carbon-900 tracking-tighter">
            {table.number}
          </h2>
          
          <div className="h-5 mt-1 flex items-center justify-center">
            {table.location ? (
              <span className="text-[10px] font-bold text-carbon-400 uppercase tracking-[0.2em]">
                {table.location}
              </span>
            ) : (
              <div className="w-1 h-1 bg-carbon-100 rounded-full opacity-0" /> // Placeholder
            )}
          </div>
          
          <div className="h-8 mt-3 flex items-center justify-center">
            {table.status === TableStatus.OCCUPIED ? (
              <div className="flex items-center gap-1.5 text-rose-600 bg-rose-100/50 px-3 py-1 rounded-full animate-pulse border border-rose-200/50">
                <Timer className="w-3 h-3" />
                <span className="text-[10px] font-black uppercase tracking-wider">45 min</span>
              </div>
            ) : (
              <div className="w-1 h-1 bg-transparent" /> // Placeholder to keep height
            )}
          </div>
        </div>

        {/* Bottom Actions: Clean & Fast */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <Button
            variant="primary"
            size="sm"
            onClick={onEdit}
            className="shadow-soft-lg"
          >
            <Edit2 className="w-3.5 h-3.5 mr-2" />
            Gestionar
          </Button>

          <div className="flex gap-1">
            <button
              onClick={() => {
                const next: Record<TableStatus, TableStatus> = {
                  [TableStatus.AVAILABLE]: TableStatus.OCCUPIED,
                  [TableStatus.OCCUPIED]: TableStatus.NEEDS_CLEANING,
                  [TableStatus.NEEDS_CLEANING]: TableStatus.AVAILABLE,
                };
                handleStatusChange(next[table.status]);
              }}
              disabled={isUpdatingStatus}
              className={cn(
                "flex-1 flex items-center justify-center rounded-2xl border-2 transition-all",
                "bg-white border-sage-100 text-carbon-600 hover:border-carbon-900 hover:text-carbon-900 shadow-soft-sm active:scale-95"
              )}
              title="Cambiar estado"
            >
              <CircleDot className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsDeleteDialogOpen(true)}
              className="w-11 h-11 flex items-center justify-center rounded-2xl border-2 border-sage-100 text-carbon-300 hover:border-rose-200 hover:text-rose-600 hover:bg-rose-50 transition-all active:scale-95 shadow-soft-sm"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.article>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Eliminar mesa"
        message={`¿Eliminar la mesa ${table.number}?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        isLoading={isDeleting}
      />
    </>
  );
}
