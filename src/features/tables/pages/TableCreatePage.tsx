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
import {
  Check,
  Loader2,
  MapPin,
  Hash,
  CircleDot,
  Clock,
  CircleCheck,
} from "lucide-react";
import { cn } from "@/utils/cn";

/**
 * TableCreatePage Component
 *
 * Modern, full-screen table creation with real-time preview.
 * 2025 UX/UI: Touch-friendly, visual feedback, clean design.
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

  // Watch form values for real-time preview
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

  // Status options with modern design
  const statusOptions = [
    {
      value: TableStatus.AVAILABLE,
      label: "Disponible",
      description: "Lista para clientes",
      icon: CircleCheck,
      bgSelected: "bg-emerald-50",
      borderSelected: "border-emerald-400 ring-2 ring-emerald-100",
      iconColor: "text-emerald-500",
      checkBg: "bg-emerald-500",
    },
    {
      value: TableStatus.OCCUPIED,
      label: "Ocupada",
      description: "En uso actualmente",
      icon: CircleDot,
      bgSelected: "bg-rose-50",
      borderSelected: "border-rose-400 ring-2 ring-rose-100",
      iconColor: "text-rose-500",
      checkBg: "bg-rose-500",
    },
    {
      value: TableStatus.NEEDS_CLEANING,
      label: "Limpieza",
      description: "Requiere atención",
      icon: Clock,
      bgSelected: "bg-amber-50",
      borderSelected: "border-amber-400 ring-2 ring-amber-100",
      iconColor: "text-amber-500",
      checkBg: "bg-amber-500",
    },
  ];

  return (
    <SidebarLayout
      title="Nueva Mesa"
      subtitle="Configura una nueva mesa para el restaurante"
      backRoute={ROUTES.TABLES}
      fullWidth
    >
      {/* Main Content - Compact Two-Column Layout */}
      <div className="h-full flex flex-col lg:flex-row min-h-[calc(100vh-64px)]">
        {/* Form Section */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-lg mx-auto lg:mx-0 space-y-6"
          >
            {/* Table Number */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <Hash className="w-4 h-4 text-sage-500" />
                <span className="text-sm font-medium text-carbon-700">
                  Identificación
                </span>
              </div>
              <Input
                label="Número de Mesa"
                type="text"
                placeholder="Ej: 1, 2, A1, VIP-1..."
                {...register("number")}
                error={errors.number?.message}
                fullWidth
                autoFocus
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-carbon-700">
                  Ubicación
                </span>
                <span className="text-xs text-carbon-400">(opcional)</span>
              </div>
              <Input
                label="Zona o Área"
                type="text"
                placeholder="Ej: Terraza, Interior, Ventana..."
                {...register("location")}
                error={errors.location?.message}
                fullWidth
              />
            </div>

            {/* Status Selection - Using Controller */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <CircleCheck className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium text-carbon-700">
                  Estado Inicial
                </span>
              </div>

              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <div className="grid gap-2">
                    {statusOptions.map((option) => {
                      const isSelected = field.value === option.value;
                      const Icon = option.icon;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => field.onChange(option.value)}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-xl",
                            "border-2 transition-all duration-200",
                            "text-left w-full",
                            isSelected
                              ? cn(option.bgSelected, option.borderSelected)
                              : "border-sage-200 bg-white hover:border-sage-300 hover:bg-sage-50/50"
                          )}
                        >
                          {/* Icon */}
                          <div
                            className={cn(
                              "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                              isSelected ? "bg-white shadow-sm" : "bg-sage-50"
                            )}
                          >
                            <Icon
                              className={cn(
                                "w-5 h-5",
                                isSelected
                                  ? option.iconColor
                                  : "text-carbon-400"
                              )}
                            />
                          </div>

                          {/* Text */}
                          <div className="flex-1 min-w-0">
                            <p
                              className={cn(
                                "font-medium text-sm",
                                isSelected
                                  ? "text-carbon-900"
                                  : "text-carbon-600"
                              )}
                            >
                              {option.label}
                            </p>
                            <p className="text-xs text-carbon-400">
                              {option.description}
                            </p>
                          </div>

                          {/* Check */}
                          {isSelected && (
                            <div
                              className={cn(
                                "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0",
                                option.checkBg
                              )}
                            >
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-sage-200/50">
              <Button
                type="button"
                variant="ghost"
                size="lg"
                onClick={() => navigate(ROUTES.TABLES)}
                disabled={isPending}
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                variant="primary"
                size="lg"
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

        {/* Preview Section - Compact */}
        <div
          className={cn(
            "lg:w-[320px] xl:w-[360px]",
            "bg-sage-50/80 border-t lg:border-t-0 lg:border-l border-sage-200/50",
            "p-4 sm:p-6",
            "flex flex-col"
          )}
        >
          {/* Preview Card - No duplicate header */}
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
    </SidebarLayout>
  );
}
