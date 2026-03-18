import { Button, Input, ImageUpload, PriceInput, Select } from "@/components";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SidebarLayout } from "@/layouts/SidebarLayout";
import { useCreateItem } from "../hooks";
import { useCategories } from "../../categories/hooks";
import { createItemSchema, type CreateItemInput } from "../schemas/itemsSchemas";
import { ROUTES } from "@/app/routes";
import { toast } from "sonner";
import { Check, Loader2, Package } from "lucide-react";
import type { AxiosErrorWithResponse } from "@/types/common";
import { InventoryType } from "@/types";
import { cn } from "@/utils/cn";

const inputClass =
  "w-full px-4 py-3 rounded-xl border-2 border-sage-300 bg-sage-50/80 text-carbon-900 placeholder:text-carbon-400 focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-sage-400";

export function MenuItemCreatePage() {
  const navigate = useNavigate();
  const { mutate: createItem, isPending } = useCreateItem();
  const { data: categories, isLoading: loadingCategories } = useCategories();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    control,
  } = useForm<CreateItemInput>({
    resolver: zodResolver(createItemSchema),
    defaultValues: {
      name: "",
      description: "",
      categoryId: 0,
      price: "",
      isAvailable: true,
      imageUrl: "",
      image: null,
      inventoryType: InventoryType.UNLIMITED,
      stockQuantity: undefined,
      lowStockAlert: undefined,
      autoMarkUnavailable: true,
    },
    mode: "onChange",
  });

  const inventoryType = watch("inventoryType");
  const isTracked = inventoryType === InventoryType.TRACKED;
  const stockQuantity = watch("stockQuantity");

  const isZeroStock = isTracked && stockQuantity === 0;

  useEffect(() => {
    if (isZeroStock) {
      setValue("isAvailable", false, { shouldValidate: true, shouldDirty: true });
      setValue("autoMarkUnavailable", true, { shouldValidate: true, shouldDirty: true });
    }
  }, [isZeroStock, setValue]);

  const onSubmit = (data: CreateItemInput) => {
    createItem(data, {
      onSuccess: () => {
        toast.success("Producto creado", {
          description: `"${data.name}" ha sido creado exitosamente`,
        });
        navigate(ROUTES.MENU_LIST);
      },
      onError: (error: AxiosErrorWithResponse) => {
        toast.error("Error al crear producto", {
          description: error.response?.data?.message || error.message,
        });
      },
    });
  };

  return (
    <SidebarLayout
      title="Nuevo Producto"
      backRoute={ROUTES.MENU_LIST}
      fullWidth
      contentClassName="p-6 lg:p-10"
    >
      <div className="max-w-2xl mx-auto pt-4">
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
                    required
                    type="text"
                    placeholder="Ej: Hamburguesa Clásica..."
                    {...register("name")}
                    error={errors.name?.message}
                    fullWidth
                    autoFocus
                    className="text-lg"
                  />
                  
                  <Input
                    label="Descripción"
                    optional
                    type="text"
                    placeholder="Describe el producto para los clientes..."
                    {...register("description")}
                    error={errors.description?.message}
                    fullWidth
                  />

                  <Select
                    label="Categoría"
                    required
                    options={categories?.map(c => ({ label: c.name, value: c.id })) || []}
                    {...register("categoryId", { valueAsNumber: true })}
                    error={errors.categoryId?.message}
                    disabled={loadingCategories}
                  />
                </div>
              </section>

              <section className="pt-6 border-t border-sage-200">
                <h3 className="text-lg font-semibold text-carbon-800 mb-4">
                  Precio e imagen
                </h3>
                <div className="space-y-6">
                  <Controller
                    name="price"
                    control={control}
                    render={({ field }) => (
                      <PriceInput
                        label="Precio de venta"
                        required
                        placeholder="Ej: 15000"
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.price?.message}
                        fullWidth
                      />
                    )}
                  />
                  
                  <Controller
                    name="image"
                    control={control}
                    render={({ field }) => (
                      <ImageUpload
                        label="Imagen del producto"
                        value={field.value}
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
                <div className="space-y-6">
                  <Select
                    label="Tipo de inventario"
                    required
                    options={[
                      { label: "Ilimitado (sin control)", value: InventoryType.UNLIMITED },
                      { label: "Rastreado (con control de stock)", value: InventoryType.TRACKED },
                    ]}
                    {...register("inventoryType")}
                    error={errors.inventoryType?.message}
                    helperText="Rastreado = control de stock; Ilimitado = sin control"
                  />

                  {isTracked && (
                    <div className="p-5 bg-sage-50/80 border-2 border-sage-200 rounded-xl space-y-6">
                      <div className="flex items-center gap-2">
                        <Package className="w-5 h-5 text-sage-600" />
                        <h4 className="font-semibold text-carbon-900">
                          Configuración de stock
                        </h4>
                      </div>
                      
                      <Input
                        label="Stock Inicial"
                        required
                        type="number"
                        placeholder="Ej: 100"
                        {...register("stockQuantity", { valueAsNumber: true })}
                        error={errors.stockQuantity?.message}
                        min={0}
                        fullWidth
                        helperText="Cantidad con la que iniciará el inventario"
                      />

                      <Input
                        label="Alerta de stock bajo"
                        optional
                        type="number"
                        placeholder="Ej: 10"
                        {...register("lowStockAlert", { valueAsNumber: true })}
                        error={errors.lowStockAlert?.message}
                        min={0}
                        fullWidth
                        helperText="Se mostrará alerta cuando el stock llegue a este nivel"
                      />

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
                </div>
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
                        <span className="ml-2 text-xs font-bold text-error-500 tracking-wide">
                          (Sin stock)
                        </span>
                      )}
                    </span>
                  </label>
                </div>
              </section>
            </div>

            <div className="px-6 lg:px-8 py-5 bg-sage-50/50 border-t border-sage-200 rounded-b-2xl">
              <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="lg"
                  onClick={() => navigate(ROUTES.MENU_LIST)}
                  disabled={isPending}
                  className="sm:min-w-[120px]"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isPending}
                  disabled={!isValid}
                  className="sm:min-w-[180px]"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Creando...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Crear Producto
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </SidebarLayout>
  );
}
