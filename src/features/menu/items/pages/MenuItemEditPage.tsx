import { useParams, useNavigate } from "react-router-dom";
import { useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SidebarLayout } from "@/layouts/SidebarLayout";
import {
  Button,
  Input,
  Skeleton,
  EmptyState,
  ConfirmDialog,
} from "@/components";
import {
  useMenuItem,
  useUpdateItem,
  useDeleteItem,
  useAddStock,
  useSetInventoryType,
} from "../hooks";
import { useCategories } from "../../categories/hooks";
import {
  updateItemSchema,
  type UpdateItemInput,
} from "../schemas/itemsSchemas";
import { ROUTES } from "@/app/routes";
import { toast } from "sonner";
import { Check, Trash2, XCircle, Package } from "lucide-react";
import { useState, useEffect } from "react";
import { InventoryType } from "@/types";
import { cn } from "@/utils/cn";

const inputClass =
  "w-full px-4 py-3 rounded-xl border-2 border-sage-300 bg-sage-50/80 text-carbon-900 placeholder:text-carbon-400 focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-sage-400";

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
  const { mutateAsync: updateItem } = useUpdateItem();
  const { mutateAsync: deleteItem, isPending: isDeleting } = useDeleteItem();
  const { mutateAsync: addStock } = useAddStock();
  const { mutateAsync: setInventoryTypeMutation } = useSetInventoryType();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    setValue,
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
          stockQuantity: item.stockQuantity ?? undefined,
          lowStockAlert: item.lowStockAlert ?? undefined,
          autoMarkUnavailable: item.autoMarkUnavailable,
        }
      : undefined,
    mode: "onTouched",
  });

  const inventoryType = watch("inventoryType");
  const isTracked = inventoryType === InventoryType.TRACKED;
  const wasTracked = item?.inventoryType === InventoryType.TRACKED;
  const stockQuantity = watch("stockQuantity");

  const isZeroStock = isTracked && stockQuantity === 0;

  useEffect(() => {
    if (isZeroStock) {
      setValue("isAvailable", false, { shouldValidate: true, shouldDirty: true });
    }
  }, [isZeroStock, setValue]);

  if (isLoading) {
    return (
      <SidebarLayout
        title="Cargando..."
        backRoute={ROUTES.MENU_LIST}
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
        backRoute={ROUTES.MENU_LIST}
        fullWidth
        contentClassName="p-6 lg:p-10"
      >
        <div className="max-w-2xl mx-auto">
          <EmptyState
            icon={<XCircle />}
            title="Producto no encontrado"
            description="El producto que buscas no existe o fue eliminado"
            actionLabel="Volver al Menú"
            onAction={() => navigate(ROUTES.MENU_LIST)}
          />
        </div>
      </SidebarLayout>
    );
  }

  const onSubmit = async (data: UpdateItemInput) => {
    setIsSaving(true);
    try {
      // 1. Basic product update
      const payload: Record<string, unknown> = {};
      const basicFields = [
        "name",
        "description",
        "categoryId",
        "price",
        "isAvailable",
        "imageUrl",
        "autoMarkUnavailable",
      ];

      basicFields.forEach((field) => {
        if (data[field as keyof UpdateItemInput] !== undefined) {
          payload[field] = data[field as keyof UpdateItemInput];
        }
      });

      await updateItem({ id: item.id, ...payload } as UpdateItemInput & {
        id: number;
      });

      // 2. Inventory type change logic
      if (data.inventoryType !== item.inventoryType) {
        await setInventoryTypeMutation({
          id: item.id,
          inventoryType: data.inventoryType!,
          lowStockAlert: data.lowStockAlert,
        });

        // 3. Initial stock logic: If switching to TRACKED and initial stock > 0
        if (
          data.inventoryType === InventoryType.TRACKED &&
          data.stockQuantity &&
          data.stockQuantity > 0
        ) {
          await addStock({
            id: item.id,
            stockData: {
              quantity: data.stockQuantity,
              reason: "Stock inicial al activar rastreo",
            },
          });
        }
      } else if (isTracked && data.lowStockAlert !== item.lowStockAlert) {
        // Just update alert if type didn't change but alert did
        await setInventoryTypeMutation({
          id: item.id,
          inventoryType: InventoryType.TRACKED,
          lowStockAlert: data.lowStockAlert,
        });
      }

      toast.success("Producto actualizado", {
        description: `"${data.name || item.name}" ha sido actualizado correctamente`,
      });
      navigate(ROUTES.MENU_LIST_LIST);
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Error al actualizar producto", {
        description:
          error instanceof Error ? error.message : "Error desconocido",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteItem(item.id);
      toast.success("Producto eliminado");
      navigate(ROUTES.MENU_LIST_LIST);
    } catch (error) {
      toast.error("Error al eliminar producto", {
        description: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  };

  const onFormError = (_formErrors: FieldErrors<UpdateItemInput>) => {
    // Errores de validación manejados por react-hook-form
  };

  return (
    <>
      <SidebarLayout
        title={`Editar: ${item.name}`}
        backRoute={ROUTES.MENU_LIST}
        fullWidth
        contentClassName="p-6 lg:p-10"
      >
        <div className="max-w-2xl mx-auto space-y-8 pt-4">
          <div className="bg-white rounded-2xl border border-sage-200 shadow-sm">
            <form onSubmit={handleSubmit(onSubmit, onFormError)}>
              <div className="p-6 lg:p-8 space-y-8">
                <section>
                  <h3 className="text-lg font-semibold text-carbon-800 mb-4">
                    Datos básicos
                  </h3>
                  <div className="space-y-6">
                    <Input
                      label="Nombre del producto"
                      required
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
                        <span className="text-carbon-400 font-normal ml-2 text-xs">(opcional)</span>
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
                        <span className="text-carbon-400 font-normal ml-1">*</span>
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
                      required
                      type="text"
                      placeholder="Ej: 15000"
                      {...register("price")}
                      error={errors.price?.message}
                      fullWidth
                    />
                    <Input
                      label="URL de imagen"
                      optional
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
                      <span className="text-carbon-400 font-normal ml-1">*</span>
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
                        <Package className="w-5 h-5 text-sage-600" />
                        <h4 className="font-semibold text-carbon-900">
                          Configuración de stock
                        </h4>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-carbon-800 mb-3">
                          {wasTracked ? "Stock actual" : "Stock Inicial"}
                          {!wasTracked && <span className="text-carbon-400 font-normal ml-1">*</span>}
                        </label>
                        <Input
                          type="number"
                          placeholder={wasTracked ? "Ver stock" : "Ej: 100"}
                          {...register("stockQuantity", {
                            valueAsNumber: true,
                          })}
                          error={errors.stockQuantity?.message}
                          min={0}
                          fullWidth
                          disabled={wasTracked}
                        />
                        {wasTracked && (
                          <p className="text-xs text-carbon-500 mt-2">
                            Para modificar el stock actual, usa la sección de
                            &quot;Gestión de Stock&quot; al final de la página.
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-carbon-800 mb-3">
                          Alerta de stock bajo
                          <span className="text-carbon-400 font-normal ml-2 text-xs">(opcional)</span>
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
                          className="w-5 h-5 rounded border-sage-300 text-sage-600 focus:ring-sage-400"
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
                                  <label className={cn("flex items-center gap-3", isZeroStock ? "cursor-not-allowed" : "cursor-pointer")}>
                                    <input
                                      type="checkbox"
                                      {...register("isAvailable")}
                                      disabled={isZeroStock}
                                      className="w-5 h-5 rounded border-sage-300 text-sage-600 focus:ring-sage-400 disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                    <span className={cn(isZeroStock ? "text-carbon-400" : "text-carbon-800")}>
                                      Disponible en el menú
                                      {isZeroStock && (
                                        <span className="ml-2 text-xs font-bold text-rose-500 uppercase tracking-wider">
                                          (Sin stock)
                                        </span>
                                      )}
                                    </span>
                                  </label>
                                </div>
                              </section>              </div>

              <div className="px-6 lg:px-8 py-5 bg-sage-50/50 border-t border-sage-200 rounded-b-2xl space-y-4">
                <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="lg"
                    onClick={() => navigate(ROUTES.MENU_LIST)}
                    disabled={isSaving}
                    className="sm:min-w-[120px]"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={isSaving}
                    disabled={isSaving || !isDirty}
                    className="sm:min-w-[180px]"
                  >
                    {!isSaving && <Check className="w-5 h-5 mr-2" />}
                    Guardar Cambios
                  </Button>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="lg"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                  disabled={isSaving}
                >
                  <Trash2 className="w-5 h-5 mr-2" />
                  Eliminar producto
                </Button>
              </div>
            </form>
          </div>
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
