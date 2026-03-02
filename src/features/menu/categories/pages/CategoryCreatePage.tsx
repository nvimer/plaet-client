import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SidebarLayout } from "@/layouts/SidebarLayout";
import { Button, Input } from "@/components";
import { useCreateCategory } from "../hooks";
import {
  createCategorySchema,
  type CreateCategoryInput,
} from "../schemas/categorySchemas";
import { ROUTES } from "@/app/routes";
import { toast } from "sonner";
import { Check, Loader2 } from "lucide-react";
import type { AxiosErrorWithResponse } from "@/types/common";

/**
 * CategoryCreatePage Component
 *
 * Create a new menu category. Uses SidebarLayout and card form
 * aligned with the app design system (claude.md).
 */
export function CategoryCreatePage() {
  const navigate = useNavigate();
  const { mutate: createCategory, isPending } = useCreateCategory();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CreateCategoryInput>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      description: "",
      order: 0,
    },
    mode: "onChange",
  });

  const onSubmit = (data: CreateCategoryInput) => {
    createCategory(data, {
      onSuccess: () => {
        toast.success("Categoría creada", {
          description: `"${data.name}" ha sido creada exitosamente`,
        });
        navigate(ROUTES.MENU_LIST);
      },
      onError: (error: AxiosErrorWithResponse) => {
        toast.error("Error al crear categoría", {
          description: error.response?.data?.message || error.message,
        });
      },
    });
  };

  return (
    <SidebarLayout
      title="Nueva Categoría"
      backRoute={ROUTES.MENU_LIST}
      fullWidth
      contentClassName="p-6 lg:p-10"
    >
      <div className="max-w-2xl mx-auto">
        <div className="mb-10">
          <h2 className="text-2xl lg:text-3xl font-semibold text-carbon-900 mb-2">
            Crear Nueva Categoría
          </h2>
          <p className="text-carbon-500">
            Organiza tu menú con categorías (ej: Bebidas, Platos principales)
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
                  placeholder="Describe la categoría para tu equipo..."
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
                  disabled={isPending || !isValid}
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
                      Crear Categoría
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
