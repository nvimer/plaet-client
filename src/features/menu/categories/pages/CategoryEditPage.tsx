import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FullScreenLayout } from "@/layouts/FullScreenLayout";
import { Button, Input, Skeleton, EmptyState, ConfirmDialog } from "@/components";
import { useCategory, useUpdateCategory, useDeleteCategory } from "../hooks";
import {
  updateCategorySchema,
  type UpdateCategoryInput,
} from "../schemas/categorySchemas";
import { ROUTES, getCategoryEditRoute } from "@/app/routes";
import { toast } from "sonner";
import { Check, Trash2, XCircle } from "lucide-react";
import { useState } from "react";

/**
 * CategoryEditPage Component
 * 
 * Full-screen page for editing a menu category.
 */
export function CategoryEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: category, isLoading, error } = useCategory(Number(id));
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateCategoryInput>({
    resolver: zodResolver(updateCategorySchema),
    values: category
      ? {
          name: category.name,
          description: category.description || "",
          order: category.order,
        }
      : undefined,
  });

  // Loading state
  if (isLoading) {
    return (
      <FullScreenLayout title="Cargando..." backRoute={ROUTES.MENU}>
        <div className="max-w-2xl mx-auto space-y-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-64" />
        </div>
      </FullScreenLayout>
    );
  }

  // Error state
  if (error || !category) {
    return (
      <FullScreenLayout title="Error" backRoute={ROUTES.MENU}>
        <EmptyState
          icon={<XCircle />}
          title="Categoría no encontrada"
          description="La categoría que buscas no existe o fue eliminada"
          actionLabel="Volver al Menú"
          onAction={() => navigate(ROUTES.MENU)}
        />
      </FullScreenLayout>
    );
  }

  const onSubmit = (data: UpdateCategoryInput) => {
    updateCategory(
      { id: category.id, ...data },
      {
        onSuccess: () => {
          toast.success("Categoría actualizada", {
            description: `"${data.name || category.name}" ha sido actualizada`,
            icon: "✅",
          });
          navigate(ROUTES.MENU);
        },
        onError: (error: any) => {
          toast.error("Error al actualizar categoría", {
            description: error.response?.data?.message || error.message,
            icon: "❌",
          });
        },
      }
    );
  };

  const handleDelete = () => {
    deleteCategory(category.id, {
      onSuccess: () => {
        toast.success("Categoría eliminada", { icon: "🗑️" });
        navigate(ROUTES.MENU);
      },
      onError: (error: any) => {
        toast.error("Error al eliminar categoría", {
          description: error.response?.data?.message || error.message,
        });
      },
    });
  };

  return (
    <>
      <FullScreenLayout
        title={`Editar: ${category.name}`}
        subtitle="Modifica los datos de la categoría"
        backRoute={ROUTES.MENU}
      >
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <Input
              label="Nombre de la categoría"
              type="text"
              {...register("name")}
              error={errors.name?.message}
              fullWidth
            />

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-carbon-700 mb-2">
                Descripción (opcional)
              </label>
              <textarea
                {...register("description")}
                placeholder="Describe la categoría..."
                rows={4}
                className="w-full px-4 py-3 border border-sage-border-subtle rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-green-300 focus:border-transparent"
              />
              {errors.description && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Order */}
            <Input
              label="Orden de visualización"
              type="number"
              {...register("order", { valueAsNumber: true })}
              error={errors.order?.message}
              fullWidth
            />

            {/* Actions */}
            <div className="flex gap-4 pt-6 border-t border-sage-border-subtle">
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
                onClick={() => setShowDeleteConfirm(true)}
                className="text-red-600 hover:bg-red-50"
                disabled={isUpdating}
                fullWidth
              >
                <Trash2 className="w-5 h-5 mr-2" />
                Eliminar
              </Button>
            </div>
          </form>
        </div>
      </FullScreenLayout>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Eliminar Categoría"
        message={`¿Estás seguro de eliminar la categoría "${category.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        isLoading={isDeleting}
      />
    </>
  );
}
