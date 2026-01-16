import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FullScreenLayout } from "@/layouts/FullScreenLayout";
import { Button, Input } from "@/components";
import { useCreateCategory } from "../hooks";
import {
  createCategorySchema,
  type CreateCategoryInput,
} from "../schemas/categorySchemas";
import { ROUTES } from "@/app/routes";
import { toast } from "sonner";
import { Check } from "lucide-react";

/**
 * CategoryCreatePage Component
 * 
 * Full-screen page for creating a new menu category.
 */
export function CategoryCreatePage() {
  const navigate = useNavigate();
  const { mutate: createCategory, isPending } = useCreateCategory();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCategoryInput>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      description: "",
      order: 0,
    },
  });

  const onSubmit = (data: CreateCategoryInput) => {
    createCategory(data, {
      onSuccess: () => {
        toast.success("Categoría creada", {
          description: `"${data.name}" ha sido creada exitosamente`,
          icon: "🎉",
        });
        navigate(ROUTES.MENU);
      },
      onError: (error: any) => {
        toast.error("Error al crear categoría", {
          description: error.response?.data?.message || error.message,
          icon: "❌",
        });
      },
    });
  };

  return (
    <FullScreenLayout
      title="Nueva Categoría"
      subtitle="Completa los datos para crear una nueva categoría"
      backRoute={ROUTES.MENU}
    >
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <Input
            label="Nombre de la categoría"
            type="text"
            placeholder="Ej: Bebidas, Platos Principales..."
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
              placeholder="Describe la categoría..."
              rows={4}
              className="w-full px-4 py-3 border border-sage-border-subtle rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-green-300 focus:border-transparent"
            />
            {errors.description && (
              <p className="text-sm text-red-600 mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Order */}
          <Input
            label="Orden de visualización"
            type="number"
            placeholder="0"
            {...register("order", { valueAsNumber: true })}
            error={errors.order?.message}
            fullWidth
          />

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
              Crear Categoría
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
