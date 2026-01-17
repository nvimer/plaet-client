import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FullScreenLayout } from "@/layouts/FullScreenLayout";
import { Button, Input } from "@/components";
import { useCreateItem } from "../hooks";
import { useCategories } from "../../categories/hooks";
import { createItemSchema, type CreateItemInput } from "../schemas/itemsSchemas";
import { ROUTES } from "@/app/routes";
import { toast } from "sonner";
import { Check } from "lucide-react";
import type { AxiosErrorWithResponse } from "@/types/common";

/**
 * MenuItemCreatePage Component
 * 
 * Full-screen page for creating a new menu item.
 */
export function MenuItemCreatePage() {
  const navigate = useNavigate();
  const { mutate: createItem, isPending } = useCreateItem();
  const { data: categories, isLoading: loadingCategories } = useCategories();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CreateItemInput>({
    resolver: zodResolver(createItemSchema),
    defaultValues: {
      name: "",
      description: "",
      categoryId: undefined,
      price: "",
      isExtra: false,
      isAvailable: true,
      imageUrl: "",
    },
  });

  const isExtra = watch("isExtra");

  const onSubmit = (data: CreateItemInput) => {
    createItem(data, {
      onSuccess: () => {
        toast.success("Producto creado", {
          description: `"${data.name}" ha sido creado exitosamente`,
          icon: "🎉",
        });
        navigate(ROUTES.MENU);
      },
      onError: (error: AxiosErrorWithResponse) => {
        toast.error("Error al crear producto", {
          description: error.response?.data?.message || error.message,
          icon: "❌",
        });
      },
    });
  };

  return (
    <FullScreenLayout
      title="Nuevo Producto"
      subtitle="Completa los datos para crear un nuevo producto"
      backRoute={ROUTES.MENU}
    >
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <Input
            label="Nombre del producto"
            type="text"
            placeholder="Ej: Hamburguesa Clásica..."
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
              Categoría *
            </label>
            <select
              {...register("categoryId", { valueAsNumber: true })}
              className="w-full px-4 py-3 border border-sage-border-subtle rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-green-300 focus:border-transparent"
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

          {/* Price */}
          <Input
            label="Precio"
            type="text"
            placeholder="Ej: 12.50"
            {...register("price")}
            error={errors.price?.message}
            fullWidth
          />

          {/* Image URL */}
          <Input
            label="URL de imagen (opcional)"
            type="url"
            placeholder="https://..."
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
              <span className="text-carbon-700">
                Es un extra/complemento
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register("isAvailable")}
                defaultChecked
                className="w-5 h-5 rounded border-sage-border-subtle text-sage-green-600 focus:ring-sage-green-300"
              />
              <span className="text-carbon-700">Disponible</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-6">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isPending}
              disabled={isPending}
              fullWidth
            >
              {!isPending && <Check className="w-5 h-5 mr-2" />}
              Crear Producto
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={() => navigate(ROUTES.MENU)}
              disabled={isPending}
              fullWidth
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </FullScreenLayout>
  );
}
