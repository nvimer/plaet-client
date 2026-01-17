import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FullScreenLayout } from "@/layouts/FullScreenLayout";
import { Button, Input, Skeleton, EmptyState, ConfirmDialog } from "@/components";
import { useMenuItem, useUpdateItem, useDeleteItem } from "../hooks";
import { useCategories } from "../../categories/hooks";
import { updateItemSchema, type UpdateItemInput } from "../schemas/itemsSchemas";
import { ROUTES, getMenuItemEditRoute } from "@/app/routes";
import { toast } from "sonner";
import { Check, Trash2, XCircle } from "lucide-react";
import { useState } from "react";
import type { AxiosErrorWithResponse } from "@/types/common";

/**
 * MenuItemEditPage Component
 * 
 * Full-screen page for editing a menu item.
 */
export function MenuItemEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: item, isLoading, error } = useMenuItem(Number(id));
  const { data: categories, isLoading: loadingCategories } = useCategories();
  const { mutate: updateItem, isPending: isUpdating } = useUpdateItem();
  const { mutate: deleteItem, isPending: isDeleting } = useDeleteItem();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateItemInput>({
    resolver: zodResolver(updateItemSchema),
    values: item
      ? {
          name: item.name,
          description: item.description || "",
          categoryId: item.categoryId,
          price: item.price,
          isExtra: item.isExtra,
          isAvailable: item.isAvailable,
          imageUrl: item.imageUrl || "",
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
  if (error || !item) {
    return (
      <FullScreenLayout title="Error" backRoute={ROUTES.MENU}>
        <EmptyState
          icon={<XCircle />}
          title="Producto no encontrado"
          description="El producto que buscas no existe o fue eliminado"
          actionLabel="Volver al Menú"
          onAction={() => navigate(ROUTES.MENU)}
        />
      </FullScreenLayout>
    );
  }

  const onSubmit = (data: UpdateItemInput) => {
    updateItem(
      { id: item.id, ...data },
      {
        onSuccess: () => {
          toast.success("Producto actualizado", {
            description: `"${data.name || item.name}" ha sido actualizado`,
            icon: "✅",
          });
          navigate(ROUTES.MENU);
        },
        onError: (error: AxiosErrorWithResponse) => {
          toast.error("Error al actualizar producto", {
            description: error.response?.data?.message || error.message,
            icon: "❌",
          });
        },
      }
    );
  };

  const handleDelete = () => {
    deleteItem(item.id, {
      onSuccess: () => {
        toast.success("Producto eliminado", { icon: "🗑️" });
        navigate(ROUTES.MENU);
      },
      onError: (error: AxiosErrorWithResponse) => {
        toast.error("Error al eliminar producto", {
          description: error.response?.data?.message || error.message,
        });
      },
    });
  };

  return (
    <>
      <FullScreenLayout
        title={`Editar: ${item.name}`}
        subtitle="Modifica los datos del producto"
        backRoute={ROUTES.MENU}
      >
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <Input
              label="Nombre del producto"
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
                placeholder="Describe el producto..."
                rows={3}
                className="w-full px-4 py-3 border border-sage-border-subtle rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-green-300 focus:border-transparent"
              />
              {errors.description && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-carbon-700 mb-2">
                Categoría
              </label>
              <select
                {...register("categoryId", { valueAsNumber: true })}
                className="w-full px-4 py-3 border border-sage-border-subtle rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-green-300 focus:border-transparent"
                disabled={loadingCategories}
              >
                <option value="">Selecciona una categoría</option>
                {categories?.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                    selected={category.id === item.categoryId}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.categoryId.message}
                </p>
              )}
            </div>

            {/* Price */}
            <Input
              label="Precio"
              type="text"
              {...register("price")}
              error={errors.price?.message}
              fullWidth
            />

            {/* Image URL */}
            <Input
              label="URL de imagen (opcional)"
              type="url"
              {...register("imageUrl")}
              error={errors.imageUrl?.message}
              fullWidth
            />

            {/* Toggles */}
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("isExtra")}
                  className="w-5 h-5 rounded border-sage-border-subtle text-sage-green-600 focus:ring-sage-green-300"
                />
                <span className="text-carbon-700">Es un extra/complemento</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("isAvailable")}
                  className="w-5 h-5 rounded border-sage-border-subtle text-sage-green-600 focus:ring-sage-green-300"
                />
                <span className="text-carbon-700">Disponible</span>
              </label>
            </div>

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
        title="Eliminar Producto"
        message={`¿Estás seguro de eliminar "${item.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        isLoading={isDeleting}
      />
    </>
  );
}
