import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TableStatus } from "@/types";
import type { AxiosErrorWithResponse } from "@/types/common";
import { SidebarLayout } from "@/layouts/SidebarLayout";
import { Button, Input } from "@/components";
import { useCreateTable } from "../hooks";
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
 * Full-width, clean form for creating tables.
 * Modern 2025 UX: Simple, spacious, touch-friendly.
 */
export function TableCreatePage() {
  const navigate = useNavigate();
  const { mutate: createTable, isPending } = useCreateTable();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<CreateTableInput>({
    resolver: zodResolver(createTableSchema),
    defaultValues: {
      number: "",
      location: "",
      status: TableStatus.AVAILABLE,
    },
    mode: "onChange",
  });

  const onSubmit = (data: CreateTableInput) => {
    createTable(data, {
      onSuccess: () => {
        toast.success("Mesa creada exitosamente", {
          description: `Mesa "${data.number}" lista para usar`,
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
      description: "Lista para recibir clientes",
      icon: CircleCheck,
      selectedClass: "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/20",
      iconClass: "text-emerald-500",
    },
    {
      value: TableStatus.OCCUPIED,
      label: "Ocupada",
      description: "En uso actualmente",
      icon: CircleDot,
      selectedClass: "border-rose-500 bg-rose-50 ring-2 ring-rose-500/20",
      iconClass: "text-rose-500",
    },
    {
      value: TableStatus.NEEDS_CLEANING,
      label: "Limpieza",
      description: "Requiere atención",
      icon: Clock,
      selectedClass: "border-amber-500 bg-amber-50 ring-2 ring-amber-500/20",
      iconClass: "text-amber-500",
    },
  ];

  return (
    <SidebarLayout
      title="Nueva Mesa"
      backRoute={ROUTES.TABLES}
      fullWidth
      contentClassName="p-6 lg:p-10"
    >
      <div className="max-w-2xl mx-auto pt-4">
        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-sage-200 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Form Fields */}
            <div className="p-6 lg:p-8 space-y-8">
              {/* Table Number */}
              <div>
                <label className="block text-sm font-semibold text-carbon-800 mb-3">
                  Número o Nombre de la Mesa
                </label>
                <Input
                  type="text"
                  placeholder="Ej: 1, 2, A1, VIP-1, Terraza-3..."
                  {...register("number")}
                  error={errors.number?.message}
                  fullWidth
                  autoFocus
                  className="text-lg"
                />
                <p className="mt-2 text-sm text-carbon-400">
                  Identificador único para esta mesa
                </p>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-carbon-800 mb-3">
                  Ubicación
                  <span className="font-normal text-carbon-400 ml-2">
                    (opcional)
                  </span>
                </label>
                <Input
                  type="text"
                  placeholder="Ej: Terraza, Salón principal, Junto a la ventana..."
                  {...register("location")}
                  error={errors.location?.message}
                  fullWidth
                />
                <p className="mt-2 text-sm text-carbon-400">
                  Ayuda al personal a ubicar la mesa rápidamente
                </p>
              </div>

              {/* Status Selection */}
              <div>
                <label className="block text-sm font-semibold text-carbon-800 mb-3">
                  Estado Inicial
                </label>

                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <div className="grid sm:grid-cols-3 gap-3">
                      {statusOptions.map((option) => {
                        const isSelected = field.value === option.value;
                        const Icon = option.icon;

                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => field.onChange(option.value)}
                            className={cn(
                              "relative p-4 rounded-xl text-left transition-all duration-200",
                              "border-2",
                              isSelected
                                ? option.selectedClass
                                : "border-sage-200 bg-white hover:border-sage-300 hover:bg-sage-50/50"
                            )}
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <Icon
                                className={cn(
                                  "w-5 h-5",
                                  isSelected
                                    ? option.iconClass
                                    : "text-carbon-400"
                                )}
                              />
                              <span
                                className={cn(
                                  "font-medium",
                                  isSelected
                                    ? "text-carbon-900"
                                    : "text-carbon-700"
                                )}
                              >
                                {option.label}
                              </span>
                            </div>
                            <p className="text-xs text-carbon-400 pl-8">
                              {option.description}
                            </p>

                            {/* Check indicator */}
                            {isSelected && (
                              <div className="absolute top-3 right-3">
                                <Check className={cn("w-4 h-4", option.iconClass)} />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-6 lg:px-8 py-5 bg-sage-50/50 border-t border-sage-200 rounded-b-2xl">
              <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="lg"
                  onClick={() => navigate(ROUTES.TABLES)}
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
                      Crear Mesa
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
