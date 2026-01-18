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
import { Check, Trash2, XCircle, Package } from "lucide-react";
import { useState } from "react";
import type { AxiosErrorWithResponse } from "@/types/common";
import { StockManagementSection } from "../components/StockManagementSection";
import { InventoryType } from "@/types";

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
    watch,
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
          inventoryType: (item.inventoryType as InventoryType) || InventoryType.NONE,
          initialStock: item.initialStock,
          lowStockAlert: item.lowStockAlert,
          autoMarkUnavailable: item.autoMarkUnavailable,
        }
      : undefined,
  });

  const inventoryType = watch("inventoryType");
  const isTracked = inventoryType === InventoryType.TRACKED;

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

            {/* Inventory Type */}
            <div>
              <label className="block text-sm font-medium text-carbon-700 mb-2">
                Tipo de Inventario
              </label>
              <select
                {...register("inventoryType")}
                className="w-full px-4 py-3 border border-sage-border-subtle rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-green-300 focus:border-transparent"
              >
                <option value={InventoryType.NONE}>Sin Inventario</option>
                <option value={InventoryType.TRACKED}>Rastreado (TRACKED)</option>
                <option value={InventoryType.UNLIMITED}>Ilimitado</option>
              </select>
              {errors.inventoryType && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.inventoryType.message}
                </p>
              )}
              <p className="text-xs text-carbon-500 mt-1">
                Selecciona cómo se gestionará el stock de este producto
              </p>
            </div>

            {/* Stock Configuration (only if TRACKED) */}
            {isTracked && (
              <div className="p-4 bg-sage-50 border-2 border-sage-border-subtle rounded-xl space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-5 h-5 text-sage-green-600" />
                  <h4 className="font-semibold text-carbon-900">
                    Configuración de Stock
                  </h4>
                </div>

                {/* Initial Stock */}
                <div>
                  <label className="block text-sm font-medium text-carbon-700 mb-2">
                    Stock Inicial
                  </label>
                  <Input
                    type="number"
                    placeholder="Ej: 100"
                    {...register("initialStock", { valueAsNumber: true })}
                    error={errors.initialStock?.message}
                    min="0"
                    fullWidth
                  />
                  <p className="text-xs text-carbon-500 mt-1">
                    Cantidad inicial de stock (usado en reset diario)
                  </p>
                </div>

                {/* Low Stock Alert */}
                <div>
                  <label className="block text-sm font-medium text-carbon-700 mb-2">
                    Alerta de Stock Bajo (opcional)
                  </label>
                  <Input
                    type="number"
                    placeholder="Ej: 10"
                    {...register("lowStockAlert", { valueAsNumber: true })}
                    error={errors.lowStockAlert?.message}
                    min="0"
                    fullWidth
                  />
                  <p className="text-xs text-carbon-500 mt-1">
                    Se mostrará una alerta cuando el stock llegue a este nivel
                  </p>
                </div>

                {/* Auto Mark Unavailable */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("autoMarkUnavailable")}
                    className="w-5 h-5 rounded border-sage-border-subtle text-sage-green-600 focus:ring-sage-green-300"
                  />
                  <div>
                    <span className="text-carbon-700 font-medium">
                      Marcar como no disponible automáticamente
                    </span>
                    <p className="text-xs text-carbon-500">
                      El producto se marcará como no disponible cuando el stock llegue a 0
                    </p>
                  </div>
                </label>
              </div>
            )}

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

          {/* Stock Management Section */}
          <StockManagementSection item={item} />
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
