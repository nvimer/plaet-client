import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Card, Input, Button } from "@/components";
import { Save, RefreshCw } from "lucide-react";
import { useUpdateDailyMenu } from "@/features/daily-menu";
import type { DailyMenu } from "@/services/dailyMenuApi";

interface DailyMenuFormProps {
  initialData?: DailyMenu | null;
  onSuccess?: () => void;
}

interface FormData {
  side: string;
  soup: string;
  drink: string;
  dessert: string;
}

export function DailyMenuForm({ initialData, onSuccess }: DailyMenuFormProps) {
  const updateMenu = useUpdateDailyMenu();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      side: initialData?.side || "",
      soup: initialData?.soup || "",
      drink: initialData?.drink || "",
      dessert: initialData?.dessert || "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        side: initialData.side,
        soup: initialData.soup,
        drink: initialData.drink,
        dessert: initialData.dessert || "",
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      await updateMenu.mutateAsync(data);
      reset(data);
      onSuccess?.();
    } catch (error) {
      console.error("Failed to update daily menu:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card variant="elevated" className="p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-carbon-900">
              Menú del Día
            </h2>
            <p className="text-sm text-carbon-500">
              Configura los elementos del menú para hoy
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="side"
            control={control}
            rules={{ required: "Campo requerido" }}
            render={({ field, fieldState }) => (
              <Input
                label="Acompañamiento"
                placeholder="Ej: Arroz con vegetales"
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="soup"
            control={control}
            rules={{ required: "Campo requerido" }}
            render={({ field, fieldState }) => (
              <Input
                label="Sopa"
                placeholder="Ej: Sopa de verduras"
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="drink"
            control={control}
            rules={{ required: "Campo requerido" }}
            render={({ field, fieldState }) => (
              <Input
                label="Bebida"
                placeholder="Ej: Gaseosa"
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="dessert"
            control={control}
            render={({ field, fieldState }) => (
              <Input
                label="Postre (opcional)"
                placeholder="Ej: Gelatina"
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />
        </div>

        <div className="flex justify-end mt-6 pt-4 border-t border-carbon-100">
          <Button
            type="submit"
            isLoading={isSubmitting || updateMenu.isPending}
            disabled={!isDirty}
            className="inline-flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Guardar Cambios
          </Button>
        </div>
      </Card>
    </form>
  );
}
