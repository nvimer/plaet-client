import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SidebarLayout } from "@/layouts/SidebarLayout";
import { Button, Input } from "@/components";
import { useCreateItem } from "../hooks";
import { useCategories } from "../../categories/hooks";
import { createItemSchema, type CreateItemInput } from "../schemas/itemsSchemas";
import { ROUTES } from "@/app/routes";
import { toast } from "sonner";
import { Check, Loader2, Package } from "lucide-react";
import type { AxiosErrorWithResponse } from "@/types/common";
import { InventoryType } from "@/types";

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
  } = useForm<CreateItemInput>({
    resolver: zodResolver(createItemSchema),
    defaultValues: {
      name: "",
      description: "",
      categoryId: 0,
      price: "",
      isAvailable: true,
      imageUrl: "",
      inventoryType: InventoryType.UNLIMITED,
      stockQuantity: undefined,
      lowStockAlert: undefined,
      autoMarkUnavailable: false,
    },
    mode: "onTouched",
  });

  const inventoryType = watch("inventoryType");
  const isTracked = inventoryType === InventoryType.TRACKED;

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
                    type="text"
                    placeholder="Ej: Hamburguesa Clásica..."
                    {...register("name")}
                    error={errors.name?.message}
                    fullWidth
                    autoFocus
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
                      placeholder="Describe el producto para los clientes..."
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
                      Categoría *
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
                    placeholder="Ej: 15000"
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
                  <select {...register("inventoryType")} className={inputClass}>
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
                  <p className="mt-2 text-sm text-carbon-400">
                    Rastreado = control de stock; Ilimitado = sin control
                  </p>
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
                        Stock Inicial *
                      </label>
                      <Input
                        type="number"
                        placeholder="Ej: 100"
                        {...register("stockQuantity", { valueAsNumber: true })}
                        error={errors.stockQuantity?.message}
                        min={0}
                        fullWidth
                      />
                      <p className="mt-2 text-sm text-carbon-400">
                        Cantidad con la que iniciará el inventario
                      </p>
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
                        {...register("lowStockAlert", { valueAsNumber: true })}
                        error={errors.lowStockAlert?.message}
                        min={0}
                        fullWidth
                      />
                      <p className="mt-2 text-sm text-carbon-400">
                        Se mostrará alerta cuando el stock llegue a este nivel
                      </p>
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
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register("isAvailable")}
                      className="w-5 h-5 rounded border-sage-300 text-sage-600 focus:ring-sage-400"
                    />
                    <span className="text-carbon-800">
                      Disponible en el menú
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
