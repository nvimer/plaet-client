import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TableStatus } from "@/types";
import { FullScreenLayout } from "@/layouts/FullScreenLayout";
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
import { Check, Trash2, XCircle } from "lucide-react";
import { useState } from "react";
import { TableStatusBadge } from "../components/TableStatusBadge";

/**
 * TableManagePage Component
 *
 * Full-screen page for managing a table (view, edit, delete, change status).
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

  // Loading state
  if (isLoading) {
    return (
      <FullScreenLayout title="Cargando..." backRoute={ROUTES.TABLES}>
        <div className="max-w-2xl mx-auto space-y-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-64" />
        </div>
      </FullScreenLayout>
    );
  }

  // Error state
  if (error || !table) {
    return (
      <FullScreenLayout title="Error" backRoute={ROUTES.TABLES}>
        <EmptyState
          icon={<XCircle />}
          title="Mesa no encontrada"
          description="La mesa que buscas no existe o fue eliminada"
          actionLabel="Volver a Mesas"
          onAction={() => navigate(ROUTES.TABLES)}
        />
      </FullScreenLayout>
    );
  }

  const onSubmit = (data: UpdateTableInput) => {
    updateTable(
      { id: table.id, ...data },
      {
        onSuccess: () => {
          toast.success("Mesa actualizada", {
            description: `La mesa #${data.number || table.number} ha sido actualizada`,
            icon: "✅",
          });
          setIsEditing(false);
        },
        onError: (error: any) => {
          toast.error("Error al actualizar mesa", {
            description: error.response?.data?.message || error.message,
            icon: "❌",
          });
        },
      },
    );
  };

  const handleStatusChange = (newStatus: TableStatus) => {
    updateStatus(
      { id: table.id, status: newStatus },
      {
        onSuccess: () => {
          toast.success("Estado actualizado", { icon: "✅" });
        },
        onError: (error: any) => {
          toast.error("Error al actualizar estado", {
            description: error.response?.data?.message || error.message,
          });
        },
      },
    );
  };

  const handleDelete = () => {
    deleteTable(table.id, {
      onSuccess: () => {
        toast.success("Mesa eliminada", { icon: "🗑️" });
        navigate(ROUTES.TABLES);
      },
      onError: (error: any) => {
        toast.error("Error al eliminar mesa", {
          description: error.response?.data?.message || error.message,
        });
      },
    });
  };

  return (
    <>
      <FullScreenLayout
        title={`Mesa #${table.number}`}
        subtitle={table.location || "Sin ubicación"}
        backRoute={ROUTES.TABLES}
      >
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Status Badge */}
          <div className="flex items-center gap-4">
            <TableStatusBadge status={table.status} />
          </div>

          {isEditing ? (
            /* Edit Form */
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="Número de mesa"
                type="text"
                {...register("number")}
                error={errors.number?.message}
                fullWidth
              />

              <Input
                label="Ubicación"
                type="text"
                {...register("location")}
                error={errors.location?.message}
                fullWidth
              />

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isUpdating}
                  disabled={isUpdating}
                  fullWidth
                >
                  {!isUpdating && <Check className="w-5 h-5 mr-2" />}
                  Guardar Cambios
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="lg"
                  onClick={() => {
                    setIsEditing(false);
                    reset();
                  }}
                  disabled={isUpdating}
                  fullWidth
                >
                  Cancelar
                </Button>
              </div>
            </form>
          ) : (
            /* View Mode */
            <>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-carbon-600">
                    Número de mesa
                  </label>
                  <p className="text-2xl font-bold text-carbon-900 mt-1">
                    {table.number}
                  </p>
                </div>

                {table.location && (
                  <div>
                    <label className="text-sm font-medium text-carbon-600">
                      Ubicación
                    </label>
                    <p className="text-lg text-carbon-900 mt-1">
                      {table.location}
                    </p>
                  </div>
                )}
              </div>

              {/* Quick Status Change */}
              <div>
                <label className="text-sm font-medium text-carbon-600 mb-3 block">
                  Cambiar Estado
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {Object.values(TableStatus).map((status) => (
                    <Button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      disabled={isUpdatingStatus || table.status === status}
                      variant={table.status === status ? "primary" : "outline"}
                      size="lg"
                      className={
                        table.status === status
                          ? "border-sage-green-400 bg-sage-green-50 text-sage-green-700"
                          : ""
                      }
                      isLoading={isUpdatingStatus}
                    >
                      {status === TableStatus.AVAILABLE && "Disponible"}
                      {status === TableStatus.OCCUPIED && "Ocupada"}
                      {status === TableStatus.NEEDS_CLEANING && "Limpieza"}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4 border-t border-sage-border-subtle">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => setIsEditing(true)}
                  fullWidth
                >
                  Editar Mesa
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-red-600 hover:bg-red-50"
                  fullWidth
                >
                  <Trash2 className="w-5 h-5 mr-2" />
                  Eliminar
                </Button>
              </div>
            </>
          )}
        </div>
      </FullScreenLayout>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Eliminar Mesa"
        message={`¿Estás seguro de eliminar la mesa #${table.number}? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        isLoading={isDeleting}
      />
    </>
  );
}
