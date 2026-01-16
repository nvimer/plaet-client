import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TableStatus } from "@/types";
import { FullScreenLayout } from "@/layouts/FullScreenLayout";
import { Button, Input } from "@/components";
import { useCreateTable } from "../hooks";
import { createTableSchema, type CreateTableInput } from "../schemas/tableSchemas";
import { ROUTES } from "@/app/routes";
import { toast } from "sonner";
import { Check } from "lucide-react";

/**
 * TableCreatePage Component
 * 
 * Full-screen page for creating a new table.
 */
export function TableCreatePage() {
  const navigate = useNavigate();
  const { mutate: createTable, isPending } = useCreateTable();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTableInput>({
    resolver: zodResolver(createTableSchema),
    defaultValues: {
      number: "",
      location: "",
      status: TableStatus.AVAILABLE,
    },
  });

  const onSubmit = (data: CreateTableInput) => {
    createTable(data, {
      onSuccess: () => {
        toast.success("Mesa creada", {
          description: `La mesa #${data.number} está disponible`,
          icon: "🎉",
        });
        navigate(ROUTES.TABLES);
      },
      onError: (error: any) => {
        toast.error("Error al crear mesa", {
          description: error.response?.data?.message || error.message,
          icon: "❌",
        });
      },
    });
  };

  return (
    <FullScreenLayout
      title="Nueva Mesa"
      subtitle="Completa los datos para crear una nueva mesa"
      backRoute={ROUTES.TABLES}
    >
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Table Number */}
          <Input
            label="Número de mesa"
            type="text"
            placeholder="Ej: 1, 2, 3..."
            {...register("number")}
            error={errors.number?.message}
            fullWidth
          />

          {/* Location */}
          <Input
            label="Ubicación (opcional)"
            type="text"
            placeholder="Ej: Entrada, Sala, Ventana, Terraza..."
            {...register("location")}
            error={errors.location?.message}
            fullWidth
          />

          {/* Status - Hidden, defaults to AVAILABLE */}
          <input type="hidden" {...register("status")} />

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
              Crear Mesa
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={() => navigate(ROUTES.TABLES)}
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
