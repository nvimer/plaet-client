import { useParams, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { SidebarLayout } from "@/layouts/SidebarLayout";
import {
  Button,
  Input,
  Skeleton,
  EmptyState,
  ConfirmDialog,
  ImageUpload,
  PriceInput,
} from "@/components";
import {
  useMenuItem,
  useUpdateItem,
  useDeleteItem,
} from "../hooks";
import { useAddStock, useSetInventoryType } from "@/features/inventory/hooks";
import { useCategories } from "../../categories/hooks";
import {
  updateItemSchema,
  type UpdateItemInput,
} from "../schemas/itemsSchemas";
import { ROUTES } from "@/app/routes";
import { InventoryType } from "@/types";
import { toast } from "sonner";
import { Check, Trash2, XCircle, Package } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useForm, Controller, type FieldErrors } from "react-hook-form";
import { cn } from "@/utils/cn";
import { logger } from "@/utils";

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
    formState: { errors, isDirty: isRHFDirty },
    watch,
    setValue,
    control,
  } = useForm<UpdateItemInput>({
    resolver: zodResolver(updateItemSchema),
    values: item
      ? {
          name: item.name,
          description: item.description || "",
          categoryId: item.categoryId,
          price: String(item.price),
          isAvailable: item.isAvailable,
          imageUrl: item.imageUrl || "",
          image: null,
          inventoryType:
            (item.inventoryType as InventoryType) || InventoryType.UNLIMITED,
          stockQuantity: item.stockQuantity ?? undefined,
          lowStockAlert: item.lowStockAlert ?? undefined,
          autoMarkUnavailable: item.autoMarkUnavailable,
        }
      : undefined,
    mode: "onChange",
  });

  const watchedValues = watch();
  const image = watchedValues.image;

  // Manual dirty check for better reliability with async data
  const isDirty = useMemo(() => {
    if (!item) return false;
    if (!!image) return true;
    if (isRHFDirty) return true;

    const normalizePrice = (val: any) => String(val || "").split('.')[0].replace(/\D/g, "");

    // Check if any specific field changed compared to the loaded item
    return (
      watchedValues.name !== item.name ||
      (watchedValues.description || "") !== (item.description || "") ||
      watchedValues.categoryId !== item.categoryId ||
      normalizePrice(watchedValues.price) !== normalizePrice(item.price) ||
      watchedValues.isAvailable !== item.isAvailable ||
      watchedValues.inventoryType !== item.inventoryType ||
      watchedValues.lowStockAlert !== item.lowStockAlert ||
      watchedValues.autoMarkUnavailable !== item.autoMarkUnavailable
    );
  }, [watchedValues, item, isRHFDirty, image]);
  const originalValues = item
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
    : undefined;

  const inventoryType = watch("inventoryType");
  const isTracked = inventoryType === InventoryType.TRACKED;
  const wasTracked = item?.inventoryType === InventoryType.TRACKED;
  const stockQuantity = watch("stockQuantity");

  const isZeroStock = isTracked && stockQuantity === 0;

  useEffect(() => {
    if (isZeroStock) {
      setValue("isAvailable", false, { shouldValidate: true, shouldDirty: true });
      setValue("autoMarkUnavailable", true, { shouldValidate: true, shouldDirty: true });
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
      // 1. Update product (Service now handles FormData internally if needed)
      await updateItem({ 
        id: item.id, 
        ...data 
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
      navigate(ROUTES.MENU_LIST, { state: { highlightId: item.id } });
    } catch (error) {
      logger.error("Update error", error instanceof Error ? error : new Error(String(error)));
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
      navigate(ROUTES.MENU_LIST);
    } catch (error) {
      toast.error("Error al eliminar producto", {
        description: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  };

  const onFormError = (_formErrors: FieldErrors<UpdateItemInput>) => {
    // Validation errors handled by react-hook-form
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
                      originalValue={originalValues?.name}
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
                        className={cn(
                          inputClass,
                          watchedValues.description !== originalValues?.description &&
                            "border-sage-500 bg-sage-100/50"
                        )}
                      />
                      {errors.description && (
                        <p className="text-sm text-error-600 mt-1">
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
                        className={cn(
                          inputClass,
                          watchedValues.categoryId !== originalValues?.categoryId &&
                            "border-sage-500 bg-sage-100/50"
                        )}
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
                        <p className="text-sm text-error-600 mt-1">
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
                    <PriceInput
                      label="Precio de venta"
                      required
                      placeholder="Ej: 15000"
                      {...register("price")}
                      error={errors.price?.message}
                      fullWidth
                    />
                    
                    <Controller
                      name="image"
                      control={control}
                      render={({ field }) => (
                        <ImageUpload
                          label="Imagen del producto"
                          value={field.value || item.imageUrl}
                          onChange={field.onChange}
                          error={errors.image?.message as string}
                        />
                      )}
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
                      className={cn(
                        inputClass,
                        watchedValues.inventoryType !== originalValues?.inventoryType &&
                          "border-sage-500 bg-sage-100/50"
                      )}
                    >
                      <option value={InventoryType.UNLIMITED}>
                        Ilimitado (sin control)
                      </option>
                      <option value={InventoryType.TRACKED}>
                        Rastreado (con control de stock)
                      </option>
                    </select>
                    {errors.inventoryType && (
                      <p className="text-sm text-error-600 mt-1">
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
                          originalValue={String(originalValues?.stockQuantity ?? "")}
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
                          originalValue={String(originalValues?.lowStockAlert ?? "")}
                        />
                      </div>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          {...register("autoMarkUnavailable")}
                          className={cn(
                            "w-5 h-5 rounded border-sage-300 text-sage-600 focus:ring-sage-400",
                            watchedValues.autoMarkUnavailable !== originalValues?.autoMarkUnavailable &&
                              "ring-2 ring-sage-500 ring-offset-1"
                          )}
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
                                      className={cn(
                                        "w-5 h-5 rounded border-sage-300 text-sage-600 focus:ring-sage-400 disabled:opacity-50 disabled:cursor-not-allowed",
                                        watchedValues.isAvailable !== originalValues?.isAvailable &&
                                          "ring-2 ring-sage-500 ring-offset-1"
                                      )}
                                    />
                                    <span className={cn(isZeroStock ? "text-carbon-400" : "text-carbon-800")}>
                                      Disponible en el menú
                                      {isZeroStock && (
                                        <span className="ml-2 text-xs font-bold text-error-500 tracking-wide">
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
                  className="text-error-600 hover:bg-error-50 hover:text-error-700"
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
