import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TableStatus } from "@/types";
import type { AxiosErrorWithResponse } from "@/types/common";
import { SidebarLayout } from "@/layouts/SidebarLayout";
import {
  Button,
  Input,
  Skeleton,
  EmptyState,
  ConfirmDialog,
} from "@/components";
import {
  useTable,
  useUpdateTable,
  useDeleteTable,
  useUpdateTableStatus,
} from "../hooks";
import {
  updateTableSchema,
  type UpdateTableInput,
} from "../schemas/tableSchemas";
import { ROUTES } from "@/app/routes";
import { toast } from "sonner";
import {
  Check,
  Loader2,
  Trash2,
  XCircle,
  MapPin,
  Hash,
  CircleCheck,
  CircleDot,
  Clock,
  Edit2,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/utils/cn";

const STATUS_CONFIG = {
  [TableStatus.AVAILABLE]: {
    label: "Disponible",
    icon: CircleCheck,
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    pill: "bg-emerald-100 text-emerald-700 border-emerald-200",
    button: "border-emerald-400 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-100",
  },
  [TableStatus.OCCUPIED]: {
    label: "Ocupada",
    icon: CircleDot,
    bg: "bg-rose-50",
    border: "border-rose-200",
    text: "text-rose-700",
    pill: "bg-rose-100 text-rose-700 border-rose-200",
    button: "border-rose-400 bg-rose-50 text-rose-700 ring-2 ring-rose-100",
  },
  [TableStatus.NEEDS_CLEANING]: {
    label: "Limpieza",
    icon: Clock,
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    pill: "bg-amber-100 text-amber-700 border-amber-200",
    button: "border-amber-400 bg-amber-50 text-amber-700 ring-2 ring-amber-100",
  },
} as const;

/**
 * TableManagePage Component
 *
 * Manage a single table: view/edit details, change status, delete.
 * Uses SidebarLayout and new design system (sage, carbon, semantic colors).
 */
export function TableManagePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: table, isLoading, error } = useTable(Number(id));
  const { mutate: updateTable, isPending: isUpdating } = useUpdateTable();
  const { mutate: deleteTable, isPending: isDeleting } = useDeleteTable();
  const { mutate: updateStatus, isPending: isUpdatingStatus } =
    useUpdateTableStatus();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateTableInput>({
    resolver: zodResolver(updateTableSchema),
    values: table
      ? {
          number: table.number,
          location: table.location || "",
          status: table.status,
        }
      : undefined,
  });

  if (isLoading) {
    return (
      <SidebarLayout
        title="Cargando..."
        backRoute={ROUTES.TABLES}
        contentClassName="p-6 lg:p-8"
      >
        <div className="max-w-2xl mx-auto space-y-6">
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </SidebarLayout>
    );
  }

  if (error || !table) {
    return (
      <SidebarLayout title="Error" backRoute={ROUTES.TABLES}>
        <div className="max-w-md mx-auto py-12">
          <EmptyState
            icon={<XCircle />}
            title="Mesa no encontrada"
            description="La mesa que buscas no existe o fue eliminada"
            actionLabel="Volver a Mesas"
            onAction={() => navigate(ROUTES.TABLES)}
          />
        </div>
      </SidebarLayout>
    );
  }

  const config = STATUS_CONFIG[table.status];
  const StatusIcon = config.icon;

  const onSubmit = (data: UpdateTableInput) => {
    updateTable(
      { id: table.id, ...data },
      {
        onSuccess: () => {
          toast.success("Mesa actualizada", {
            description: `Mesa "${data.number || table.number}" actualizada`,
          });
          setIsEditing(false);
        },
        onError: (error: AxiosErrorWithResponse) => {
          toast.error("Error al actualizar", {
            description: error.response?.data?.message || error.message,
          });
        },
      }
    );
  };

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
            description: `Mesa ahora está ${labels[newStatus]}`,
          });
        },
        onError: (error: AxiosErrorWithResponse) => {
          toast.error("Error al actualizar estado", {
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
        navigate(ROUTES.TABLES);
      },
      onError: (error: AxiosErrorWithResponse) => {
        toast.error("Error al eliminar", {
          description: error.response?.data?.message || error.message,
        });
      },
    });
  };

  const statusOptions = [
    { value: TableStatus.AVAILABLE, label: "Disponible", icon: CircleCheck },
    { value: TableStatus.OCCUPIED, label: "Ocupada", icon: CircleDot },
    { value: TableStatus.NEEDS_CLEANING, label: "Limpieza", icon: Clock },
  ] as const;

  return (
    <>
      <SidebarLayout
        title={`Mesa ${table.number}`}
        subtitle={table.location || "Sin ubicación"}
        backRoute={ROUTES.TABLES}
        contentClassName="p-6 lg:p-8"
      >
        <div className="max-w-2xl mx-auto">
          {/* Status pill */}
          <div className="mb-8">
            <span
              className={cn(
                "inline-flex items-center gap-2 px-3 py-1.5 rounded-full",
                "text-sm font-medium border",
                config.pill
              )}
            >
              <StatusIcon className="w-4 h-4" />
              {config.label}
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-sage-200 shadow-sm overflow-hidden">
            {isEditing ? (
              /* Edit form */
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="p-6 lg:p-8 space-y-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-carbon-800 mb-2">
                      <Hash className="w-4 h-4 text-sage-500" />
                      Número de mesa
                    </label>
                    <Input
                      type="text"
                      placeholder="Ej: 1, A1, VIP-1..."
                      {...register("number")}
                      error={errors.number?.message}
                      fullWidth
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-carbon-800 mb-2">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      Ubicación (opcional)
                    </label>
                    <Input
                      type="text"
                      placeholder="Ej: Terraza, Salón principal..."
                      {...register("location")}
                      error={errors.location?.message}
                      fullWidth
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="ghost"
                      size="lg"
                      onClick={() => {
                        setIsEditing(false);
                        reset();
                      }}
                      disabled={isUpdating}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      isLoading={isUpdating}
                      disabled={isUpdating}
                      className="flex-1"
                    >
                      {isUpdating ? (
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      ) : (
                        <Check className="w-5 h-5 mr-2" />
                      )}
                      Guardar cambios
                    </Button>
                  </div>
                </div>
              </form>
            ) : (
              /* View mode */
              <div className="p-6 lg:p-8 space-y-8">
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-carbon-500">
                      Número de mesa
                    </label>
                    <p className="text-2xl font-bold text-carbon-900 mt-1">
                      {table.number}
                    </p>
                  </div>
                  {table.location && (
                    <div>
                      <label className="text-sm font-medium text-carbon-500">
                        Ubicación
                      </label>
                      <p className="text-lg text-carbon-800 mt-1 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-carbon-400" />
                        {table.location}
                      </p>
                    </div>
                  )}
                </div>

                {/* Quick status change */}
                <div>
                  <label className="text-sm font-semibold text-carbon-800 mb-3 block">
                    Cambiar estado
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {statusOptions.map((option) => {
                      const isActive = table.status === option.value;
                      const Icon = option.value === TableStatus.AVAILABLE
                        ? CircleCheck
                        : option.value === TableStatus.OCCUPIED
                          ? CircleDot
                          : Clock;
                      const optConfig = STATUS_CONFIG[option.value];
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleStatusChange(option.value)}
                          disabled={isUpdatingStatus || isActive}
                          className={cn(
                            "flex items-center gap-2 px-4 py-3 rounded-xl",
                            "border-2 text-sm font-medium transition-all",
                            isActive
                              ? optConfig.button
                              : "border-sage-200 bg-white text-carbon-600 hover:border-sage-300 hover:bg-sage-50"
                          )}
                        >
                          <Icon className="w-5 h-5" />
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-6 border-t border-sage-100">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => setIsEditing(true)}
                    className="flex-1 min-h-[44px]"
                  >
                    <Edit2 className="w-5 h-5 mr-2" />
                    Editar mesa
                  </Button>
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={isDeleting}
                    className="flex-1 min-h-[44px] text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                  >
                    <Trash2 className="w-5 h-5 mr-2" />
                    Eliminar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </SidebarLayout>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
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
