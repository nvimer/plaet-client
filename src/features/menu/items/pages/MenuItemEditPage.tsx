import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SidebarLayout } from "@/layouts/SidebarLayout";
import {
  Button,
  Input,
  Skeleton,
  EmptyState,
  ConfirmDialog,
} from "@/components";
import { useMenuItem, useUpdateItem, useDeleteItem } from "../hooks";
import { useCategories } from "../../categories/hooks";
import {
  updateItemSchema,
  type UpdateItemInput,
} from "../schemas/itemsSchemas";
import { ROUTES } from "@/app/routes";
import { toast } from "sonner";
import { Check, Trash2, XCircle, Package } from "lucide-react";
import { useState } from "react";
import type { AxiosErrorWithResponse } from "@/types/common";
import { StockManagementSection } from "../components/StockManagementSection";
import { InventoryType } from "@/types";

const inputClass =
  "w-full px-4 py-3 rounded-xl border-2 border-sage-300 bg-sage-50/80 text-carbon-900 placeholder:text-carbon-400 focus:outline-none focus:ring-2 focus:ring-sage-green-400 focus:border-sage-green-400";

/**
 * MenuItemEditPage Component
 *
 * Edit a menu item. Uses SidebarLayout and card form
 * aligned with the app design system.
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
    formState: { errors, isValid, isDirty },
    watch,
  } = useForm<UpdateItemInput>({
    resolver: zodResolver(updateItemSchema),
    values: item
      ? {
          name: item.name,
          description: item.description || "",
          categoryId: item.categoryId,
          price: item.price,
          isAvailable: item.isAvailable,
          imageUrl: item.imageUrl || "",
          inventoryType:
            (item.inventoryType as InventoryType) || InventoryType.UNLIMITED,
          stockQuantity: item.stockQuantity,
          lowStockAlert: item.lowStockAlert,
          autoMarkUnavailable: item.autoMarkUnavailable,
        }
      : undefined,
    mode: "onTouched",
  });

  const inventoryType = watch("inventoryType");
  const isTracked = inventoryType === InventoryType.TRACKED;

  if (isLoading) {
    return (
      <SidebarLayout
        title="Cargando..."
        backRoute={ROUTES.MENU}
        fullWidth
        contentClassName="p-6 lg:p-10"
      >
        <div className="max-w-2xl mx-auto space-y-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-32" />
          <Skeleton className="h-64" />
        </div>
      </SidebarLayout>
    );
  }

  if (error || !item) {
    return (
      <SidebarLayout
        title="Error"
        backRoute={ROUTES.MENU}
        fullWidth
        contentClassName="p-6 lg:p-10"
      >
        <div className="max-w-2xl mx-auto">
          <EmptyState
            icon={<XCircle />}
            title="Producto no encontrado"
            description="El producto que buscas no existe o fue eliminado"
            actionLabel="Volver al Menú"
            onAction={() => navigate(ROUTES.MENU)}
          />
        </div>
      </SidebarLayout>
    );
  }

  const onSubmit = (data: UpdateItemInput) => {
    // Debug: log the data being submitted
    console.log("Submitting item data:", data);

    const payload: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value === undefined) continue;

      // Debug: log each field being processed
      console.log(`Field ${key}:`, value, `(type: ${typeof value})`);

      if (
        (key === "initialStock" || key === "lowStockAlert") &&
        typeof value === "number" &&
        (Number.isNaN(value) || !Number.isFinite(value))
      ) {
        console.log(`Skipping ${key} - invalid number:`, value);
        continue;
      }
      payload[key] = value;
    }

    console.log("Final payload:", payload);

    updateItem(
      { id: item.id, ...payload } as UpdateItemInput & { id: number },
      {
        onSuccess: () => {
          toast.success("Producto actualizado", {
            description: `"${data.name || item.name}" ha sido actualizado`,
          });
          navigate(ROUTES.MENU);
        },
        onError: (error: AxiosErrorWithResponse) => {
          console.error("Update error:", error);
          toast.error("Error al actualizar producto", {
            description: error.response?.data?.message || error.message,
          });
        },
      },
    );
  };

  const handleDelete = () => {
    deleteItem(item.id, {
      onSuccess: () => {
        toast.success("Producto eliminado");
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
      <SidebarLayout
        title={`Editar: ${item.name}`}
        backRoute={ROUTES.MENU}
        fullWidth
        contentClassName="p-6 lg:p-10"
      >
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="mb-10">
            <h2 className="text-2xl lg:text-3xl font-semibold text-carbon-900 mb-2">
              Editar Producto
            </h2>
            <p className="text-carbon-500">Modifica los datos del producto</p>
          </div>

          <div className="bg-white rounded-2xl border border-sage-200 shadow-sm">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="p-6 lg:p-8 space-y-8">
                <section>
                  <h3 className="text-lg font-semibold text-carbon-800 mb-4">
                    Datos básicos
                  </h3>
                  <div className="space-y-6">
                    <Input
                      label="Nombre del producto"
                      type="text"
                      placeholder="Ej: Hamburguesa Clásica..."
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
                        placeholder="Describe el producto..."
                        rows={3}
                        className={inputClass}
                      />
                      {errors.description && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.description.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-carbon-800 mb-3">
                        Categoría
                      </label>
                      <select
                        {...register("categoryId", { valueAsNumber: true })}
                        className={inputClass}
                        disabled={loadingCategories}
                      >
                        <option value="">Selecciona una categoría</option>
                        {categories?.map((category) => (
                          <option key={category.id} value={category.id}>
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
                  </div>
                </section>

                <section className="pt-6 border-t border-sage-200">
                  <h3 className="text-lg font-semibold text-carbon-800 mb-4">
                    Precio e imagen
                  </h3>
                  <div className="space-y-6">
                    <Input
                      label="Precio"
                      type="text"
                      placeholder="Ej: 12.50"
                      {...register("price")}
                      error={errors.price?.message}
                      fullWidth
                    />
                    <Input
                      label="URL de imagen"
                      type="url"
                      placeholder="https://..."
                      {...register("imageUrl")}
                      error={errors.imageUrl?.message}
                      fullWidth
                    />
                  </div>
                </section>

                <section className="pt-6 border-t border-sage-200">
                  <h3 className="text-lg font-semibold text-carbon-800 mb-4">
                    Inventario
                  </h3>
                  <div>
                    <label className="block text-sm font-semibold text-carbon-800 mb-3">
                      Tipo de inventario
                    </label>
                    <select
                      {...register("inventoryType")}
                      className={inputClass}
                    >
                      <option value={InventoryType.UNLIMITED}>
                        Ilimitado (sin control)
                      </option>
                      <option value={InventoryType.TRACKED}>
                        Rastreado (con control de stock)
                      </option>
                    </select>
                    {errors.inventoryType && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.inventoryType.message}
                      </p>
                    )}
                  </div>

                  {isTracked && (
                    <div className="mt-6 p-5 bg-sage-50/80 border-2 border-sage-200 rounded-xl space-y-6">
                      <div className="flex items-center gap-2">
                        <Package className="w-5 h-5 text-sage-green-600" />
                        <h4 className="font-semibold text-carbon-900">
                          Configuración de stock
                        </h4>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-carbon-800 mb-3">
                        Stock
                      </label>
                      <Input
                        type="number"
                        placeholder="Ej: 100"
                        {...register("stockQuantity", { valueAsNumber: true })}
                        error={errors.stockQuantity?.message}
                        min={0}
                        fullWidth
                      />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-carbon-800 mb-3">
                          Alerta de stock bajo
                          <span className="font-normal text-carbon-400 ml-2">
                            (opcional)
                          </span>
                        </label>
                        <Input
                          type="number"
                          placeholder="Ej: 10"
                          {...register("lowStockAlert", {
                            valueAsNumber: true,
                          })}
                          error={errors.lowStockAlert?.message}
                          min={0}
                          fullWidth
                        />
                      </div>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          {...register("autoMarkUnavailable")}
                          className="w-5 h-5 rounded border-sage-300 text-sage-green-600 focus:ring-sage-green-400"
                        />
                        <div>
                          <span className="text-carbon-800 font-medium">
                            Marcar no disponible al llegar a 0
                          </span>
                        </div>
                      </label>
                    </div>
                  )}
                </section>

                <section className="pt-6 border-t border-sage-200">
                  <h3 className="text-lg font-semibold text-carbon-800 mb-4">
                    Opciones
                  </h3>
                  <div className="space-y-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        {...register("isAvailable")}
                        className="w-5 h-5 rounded border-sage-300 text-sage-green-600 focus:ring-sage-green-400"
                      />
                      <span className="text-carbon-800">
                        Disponible en el menú
                      </span>
                    </label>
                  </div>
                </section>
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
                    disabled={isUpdating || (!isDirty && !isValid)}
                    className="sm:min-w-[180px]"
                  >
                    {!isUpdating && <Check className="w-5 h-5 mr-2" />}
                    Guardar Cambios
                  </Button>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="lg"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                  disabled={isUpdating}
                >
                  <Trash2 className="w-5 h-5 mr-2" />
                  Eliminar producto
                </Button>
              </div>
            </form>
          </div>

          <StockManagementSection item={item} />
        </div>
      </SidebarLayout>

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
