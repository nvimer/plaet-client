import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SidebarLayout } from "@/layouts/SidebarLayout";
import { Button, Input, Skeleton, EmptyState, ConfirmDialog } from "@/components";
import { useCategory, useUpdateCategory, useDeleteCategory } from "../hooks";
import {
  updateCategorySchema,
  type UpdateCategoryInput,
} from "../schemas/categorySchemas";
import { ROUTES } from "@/app/routes";
import { toast } from "sonner";
import { Check, Trash2, XCircle } from "lucide-react";
import { useState } from "react";
import type { AxiosErrorWithResponse } from "@/types/common";

/**
 * CategoryEditPage Component
 *
 * Edit a menu category. Uses SidebarLayout and card form
 * aligned with the app design system.
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
    formState: { errors, isValid },
  } = useForm<UpdateCategoryInput>({
    resolver: zodResolver(updateCategorySchema),
    values: category
      ? {
          name: category.name,
          description: category.description || "",
          order: category.order,
        }
      : undefined,
    mode: "onChange",
  });

  const onSubmit = (data: UpdateCategoryInput) => {
    if (!category) return;
    updateCategory(
      { id: category.id, ...data },
      {
        onSuccess: () => {
          toast.success("Categoría actualizada", {
            description: `"${data.name || category.name}" ha sido actualizada`,
          });
          ROUTES.MENU_LIST
        },
        onError: (error: AxiosErrorWithResponse) => {
          toast.error("Error al actualizar categoría", {
            description: error.response?.data?.message || error.message,
          });
        },
      }
    );
  };

  const handleDelete = () => {
    if (!category) return;
    deleteCategory(category.id, {
      onSuccess: () => {
        toast.success("Categoría eliminada");
        ROUTES.MENU_LIST
      },
      onError: (error: AxiosErrorWithResponse) => {
        toast.error("Error al eliminar categoría", {
          description: error.response?.data?.message || error.message,
        });
      },
    });
  };

  if (isLoading) {
    return (
      <SidebarLayout title="Cargando..." backRoute={ROUTES.MENU} fullWidth contentClassName="p-6 lg:p-10">
        <div className="max-w-2xl mx-auto space-y-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-32" />
          <Skeleton className="h-64" />
        </div>
      </SidebarLayout>
    );
  }

  if (error || !category) {
    return (
      <SidebarLayout title="Error" backRoute={ROUTES.MENU} fullWidth contentClassName="p-6 lg:p-10">
        <div className="max-w-2xl mx-auto">
          <EmptyState
            icon={<XCircle />}
            title="Categoría no encontrada"
            description="La categoría que buscas no existe o fue eliminada"
            actionLabel="Volver al Menú"
            onAction={() => navigate(ROUTES.MENU)}
          />
        </div>
      </SidebarLayout>
    );
  }

  return (
    <>
      <SidebarLayout
        title={`Editar: ${category.name}`}
        backRoute={ROUTES.MENU}
        fullWidth
        contentClassName="p-6 lg:p-10"
      >
        <div className="max-w-2xl mx-auto">
          <div className="mb-10">
            <h2 className="text-2xl lg:text-3xl font-semibold text-carbon-900 mb-2">
              Editar Categoría
            </h2>
            <p className="text-carbon-500">
              Modifica los datos de la categoría
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-sage-200 shadow-sm">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="p-6 lg:p-8 space-y-8">
                <Input
                  label="Nombre de la categoría"
                  type="text"
                  placeholder="Ej: Bebidas, Platos Principales..."
                  {...register("name")}
                  error={errors.name?.message}
                  fullWidth
                  className="text-lg"
                />

                <div>
                  <label className="block text-sm font-semibold text-carbon-800 mb-3">
                    Descripción
                    <span className="font-normal text-carbon-400 ml-2">
                      (opcional)
                    </span>
                  </label>
                  <textarea
                    {...register("description")}
                    placeholder="Describe la categoría..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border-2 border-sage-300 bg-sage-50/80 text-carbon-900 placeholder:text-carbon-400 focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-sage-400"
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-carbon-800 mb-3">
                    Orden de visualización
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    {...register("order", { valueAsNumber: true })}
                    error={errors.order?.message}
                    fullWidth
                  />
                  <p className="mt-2 text-sm text-carbon-400">
                    Número menor = aparece primero en el menú
                  </p>
                </div>
              </div>

              <div className="px-6 lg:px-8 py-5 bg-sage-50/50 border-t border-sage-200 rounded-b-2xl space-y-4">
                <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="lg"
                    onClick={() => navigate(ROUTES.MENU)}
                    disabled={isUpdating}
                    className="sm:min-w-[120px]"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={isUpdating}
                    disabled={isUpdating || !isValid}
                    className="sm:min-w-[180px]"
                  >
                    {!isUpdating && <Check className="w-5 h-5 mr-2" />}
                    Guardar Cambios
                  </Button>
                </div>
                <div className="pt-4 border-t border-sage-200">
                  <Button
                    type="button"
                    variant="ghost"
                    size="lg"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    disabled={isUpdating}
                  >
                    <Trash2 className="w-5 h-5 mr-2" />
                    Eliminar categoría
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </SidebarLayout>

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
