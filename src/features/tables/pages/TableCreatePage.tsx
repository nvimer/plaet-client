import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TableStatus } from "@/types";
import type { AxiosErrorWithResponse } from "@/types/common";
import { SidebarLayout } from "@/layouts/SidebarLayout";
import { Button, Input } from "@/components";
import { useCreateTable } from "../hooks";
import { TablePreview } from "../components/TablePreview";
import {
  createTableSchema,
  type CreateTableInput,
} from "../schemas/tableSchemas";
import { ROUTES } from "@/app/routes";
import { toast } from "sonner";
import { Check, Loader2, CircleDot, Clock, CircleCheck } from "lucide-react";
import { cn } from "@/utils/cn";

/**
 * TableCreatePage Component
 *
 * Clean, centered layout with form and preview side by side.
 */
export function TableCreatePage() {
  const navigate = useNavigate();
  const { mutate: createTable, isPending } = useCreateTable();

  const {
    register,
    handleSubmit,
    control,
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

  const formValues = watch();

  const onSubmit = (data: CreateTableInput) => {
    createTable(data, {
      onSuccess: () => {
        toast.success("Mesa creada exitosamente", {
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

  const statusOptions = [
    {
      value: TableStatus.AVAILABLE,
      label: "Disponible",
      icon: CircleCheck,
      color: "emerald",
    },
    {
      value: TableStatus.OCCUPIED,
      label: "Ocupada",
      icon: CircleDot,
      color: "rose",
    },
    {
      value: TableStatus.NEEDS_CLEANING,
      label: "Limpieza",
      icon: Clock,
      color: "amber",
    },
  ];

  return (
    <SidebarLayout
      title="Nueva Mesa"
      subtitle="Crear mesa para el restaurante"
      backRoute={ROUTES.TABLES}
    >
      {/* Centered Content Card */}
      <div className="bg-white rounded-2xl border border-sage-200/60 shadow-sm overflow-hidden">
        <div className="grid lg:grid-cols-[1fr,280px]">
          {/* Form Section */}
          <div className="p-6 lg:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Table Number */}
              <Input
                label="Número de Mesa"
                type="text"
                placeholder="Ej: 1, 2, A1, VIP-1..."
                {...register("number")}
                error={errors.number?.message}
                fullWidth
                autoFocus
              />

              {/* Location */}
              <Input
                label="Ubicación (opcional)"
                type="text"
                placeholder="Ej: Terraza, Interior, Ventana..."
                {...register("location")}
                error={errors.location?.message}
                fullWidth
              />

              {/* Status Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-carbon-700">
                  Estado Inicial
                </label>

                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <div className="flex gap-2">
                      {statusOptions.map((option) => {
                        const isSelected = field.value === option.value;
                        const Icon = option.icon;

                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => field.onChange(option.value)}
                            className={cn(
                              "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl",
                              "border-2 transition-all duration-200",
                              "text-sm font-medium",
                              isSelected
                                ? option.color === "emerald"
                                  ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                                  : option.color === "rose"
                                    ? "border-rose-400 bg-rose-50 text-rose-700"
                                    : "border-amber-400 bg-amber-50 text-amber-700"
                                : "border-sage-200 bg-white text-carbon-600 hover:border-sage-300 hover:bg-sage-50"
                            )}
                          >
                            <Icon className="w-4 h-4" />
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate(ROUTES.TABLES)}
                  disabled={isPending}
                >
                  Cancelar
                </Button>

                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isPending}
                  disabled={isPending || !isValid}
                  className="flex-1"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creando...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Crear Mesa
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Preview Section - Right side */}
          <div className="bg-sage-50/50 border-t lg:border-t-0 lg:border-l border-sage-200/50 p-6">
            <TablePreview
              tableData={{
                number: formValues.number || "",
                location: formValues.location || "",
                status: formValues.status,
              }}
              compact
            />
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
