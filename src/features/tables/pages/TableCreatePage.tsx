import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TableStatus } from "@/types";
import type { AxiosErrorWithResponse } from "@/types/common";
import { SidebarLayout } from "@/layouts/SidebarLayout";
import { Button, Input, Card } from "@/components";
import { useCreateTable } from "../hooks";
import { TablePreview } from "../components/TablePreview";
import {
  createTableSchema,
  type CreateTableInput,
} from "../schemas/tableSchemas";
import { ROUTES } from "@/app/routes";
import { toast } from "sonner";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";

/**
 * TableCreatePage Component
 *
 * Simple, functional table creation with real-time preview.
 */
export function TableCreatePage() {
  const navigate = useNavigate();
  const { mutate: createTable, isPending } = useCreateTable();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<CreateTableInput>({
    resolver: zodResolver(createTableSchema),
    defaultValues: {
      number: "",
      location: "",
      status: TableStatus.AVAILABLE,
    },
    mode: "onChange",
  });

  // Watch ALL form values for real-time preview
  const number = watch("number");
  const location = watch("location");
  const status = watch("status");

  const onSubmit = (data: CreateTableInput) => {
    createTable(data, {
      onSuccess: () => {
        toast.success("Mesa creada", {
          description: `Mesa #${data.number} lista para usar`,
        });
        navigate(ROUTES.TABLES);
      },
      onError: (error: AxiosErrorWithResponse) => {
        toast.error("Error al crear mesa", {
          description: error.response?.data?.message || error.message,
        });
      },
    });
  };

  // Status options
  const statusOptions = [
    {
      value: TableStatus.AVAILABLE,
      label: "Disponible",
      emoji: "🟢",
    },
    {
      value: TableStatus.OCCUPIED,
      label: "Ocupada",
      emoji: "🔴",
    },
    {
      value: TableStatus.NEEDS_CLEANING,
      label: "Limpieza",
      emoji: "🟡",
    },
  ];

  return (
    <SidebarLayout
      title="Nueva Mesa"
      subtitle="Agrega una nueva mesa al restaurante"
      backRoute={ROUTES.TABLES}
    >
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Form */}
        <div className="order-2 lg:order-1">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Info */}
            <Card variant="default" padding="lg" className="space-y-6">
              <h2 className="text-lg font-medium text-carbon-800 pb-4 border-b border-sage-200/50">
                Información
              </h2>

              <Input
                label="Número de Mesa"
                type="text"
                placeholder="Ej: 1, 2, A1..."
                {...register("number")}
                error={errors.number?.message}
                fullWidth
                autoFocus
              />

              <Input
                label="Ubicación (opcional)"
                type="text"
                placeholder="Ej: Terraza, Ventana..."
                {...register("location")}
                error={errors.location?.message}
                fullWidth
              />
            </Card>

            {/* Status */}
            <Card variant="default" padding="lg" className="space-y-6">
              <h2 className="text-lg font-medium text-carbon-800 pb-4 border-b border-sage-200/50">
                Estado Inicial
              </h2>

              <div className="grid gap-3">
                {statusOptions.map((option) => {
                  const isSelected = status === option.value;
                  return (
                    <label
                      key={option.value}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-xl cursor-pointer",
                        "min-h-[56px] border-2 transition-all duration-200",
                        isSelected
                          ? "border-sage-green-400 bg-sage-green-50/50"
                          : "border-sage-200 bg-white hover:border-sage-300"
                      )}
                    >
                      <input
                        type="radio"
                        value={option.value}
                        {...register("status")}
                        className="sr-only"
                      />
                      <span className="text-2xl">{option.emoji}</span>
                      <span className="font-medium text-carbon-800">
                        {option.label}
                      </span>
                      {isSelected && (
                        <div className="ml-auto w-6 h-6 rounded-full bg-sage-green-500 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </label>
                  );
                })}
              </div>
            </Card>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isPending}
                disabled={isPending || !isValid}
                fullWidth
                className="min-h-[52px]"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creando...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Crear Mesa
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="lg"
                onClick={() => navigate(ROUTES.TABLES)}
                disabled={isPending}
                className="min-h-[52px]"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>

        {/* Preview - Updates in real-time */}
        <div className="order-1 lg:order-2">
          <div className="lg:sticky lg:top-24">
            <TablePreview
              tableData={{
                number: number || "",
                location: location || "",
                status: status,
              }}
            />
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
