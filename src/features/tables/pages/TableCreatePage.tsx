import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
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
  Sparkles,
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
  const number = watch("number");
  const location = watch("location");
  const status = watch("status");

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
      color: "emerald",
    },
    {
      value: TableStatus.OCCUPIED,
      label: "Ocupada",
      description: "En uso actualmente",
      icon: CircleDot,
      color: "rose",
    },
    {
      value: TableStatus.NEEDS_CLEANING,
      label: "Limpieza",
      description: "Requiere atención",
      icon: Clock,
      color: "amber",
    },
  ];

  const getStatusStyles = (color: string, isSelected: boolean) => {
    const styles: Record<string, string> = {
      emerald: isSelected
        ? "border-emerald-400 bg-emerald-50 ring-2 ring-emerald-200"
        : "border-sage-200 hover:border-emerald-300 hover:bg-emerald-50/50",
      rose: isSelected
        ? "border-rose-400 bg-rose-50 ring-2 ring-rose-200"
        : "border-sage-200 hover:border-rose-300 hover:bg-rose-50/50",
      amber: isSelected
        ? "border-amber-400 bg-amber-50 ring-2 ring-amber-200"
        : "border-sage-200 hover:border-amber-300 hover:bg-amber-50/50",
    };
    return styles[color] || styles.emerald;
  };

  const getIconColor = (color: string, isSelected: boolean) => {
    if (!isSelected) return "text-carbon-400";
    const colors: Record<string, string> = {
      emerald: "text-emerald-500",
      rose: "text-rose-500",
      amber: "text-amber-500",
    };
    return colors[color] || colors.emerald;
  };

  return (
    <SidebarLayout
      title="Nueva Mesa"
      subtitle="Configura una nueva mesa para el restaurante"
      backRoute={ROUTES.TABLES}
      fullWidth
    >
      {/* Main Content - Full Width Grid */}
      <div className="h-full flex flex-col lg:flex-row">
        {/* Form Section */}
        <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-xl mx-auto lg:mx-0">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Section: Basic Info */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center">
                    <Hash className="w-5 h-5 text-sage-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-carbon-900">
                      Identificación
                    </h2>
                    <p className="text-sm text-carbon-400">
                      Nombre único de la mesa
                    </p>
                  </div>
                </div>

                {/* Table Number Input */}
                <div className="space-y-2">
                  <Input
                    label="Número de Mesa"
                    type="text"
                    placeholder="Ej: 1, 2, A1, VIP-1..."
                    {...register("number")}
                    error={errors.number?.message}
                    fullWidth
                    autoFocus
                    className="text-lg"
                  />
                  <p className="text-xs text-carbon-400 pl-1">
                    Usa letras y números para identificar la mesa
                  </p>
                </div>
              </section>

              {/* Section: Location */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-carbon-900">
                      Ubicación
                    </h2>
                    <p className="text-sm text-carbon-400">
                      Zona donde se encuentra
                    </p>
                  </div>
                </div>

                <Input
                  label="Zona o Área"
                  type="text"
                  placeholder="Ej: Terraza, Interior, Ventana, VIP..."
                  {...register("location")}
                  error={errors.location?.message}
                  fullWidth
                />
              </section>

              {/* Section: Status */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-carbon-900">
                      Estado Inicial
                    </h2>
                    <p className="text-sm text-carbon-400">
                      ¿En qué estado comienza?
                    </p>
                  </div>
                </div>

                {/* Status Options - Touch Friendly Cards */}
                <div className="grid gap-3">
                  {statusOptions.map((option) => {
                    const isSelected = status === option.value;
                    const Icon = option.icon;

                    return (
                      <label
                        key={option.value}
                        className={cn(
                          "relative flex items-center gap-4 p-4 rounded-2xl cursor-pointer",
                          "border-2 transition-all duration-200",
                          "min-h-[72px]",
                          getStatusStyles(option.color, isSelected)
                        )}
                      >
                        <input
                          type="radio"
                          value={option.value}
                          {...register("status")}
                          className="sr-only"
                        />

                        {/* Icon */}
                        <div
                          className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center",
                            "transition-all duration-200",
                            isSelected ? "bg-white shadow-sm" : "bg-sage-50"
                          )}
                        >
                          <Icon
                            className={cn(
                              "w-6 h-6 transition-colors",
                              getIconColor(option.color, isSelected)
                            )}
                          />
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <p
                            className={cn(
                              "font-medium transition-colors",
                              isSelected ? "text-carbon-900" : "text-carbon-700"
                            )}
                          >
                            {option.label}
                          </p>
                          <p className="text-sm text-carbon-400 truncate">
                            {option.description}
                          </p>
                        </div>

                        {/* Check indicator */}
                        {isSelected && (
                          <div
                            className={cn(
                              "w-6 h-6 rounded-full flex items-center justify-center",
                              option.color === "emerald" && "bg-emerald-500",
                              option.color === "rose" && "bg-rose-500",
                              option.color === "amber" && "bg-amber-500"
                            )}
                          >
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </label>
                    );
                  })}
                </div>
              </section>

              {/* Action Buttons - Sticky on Mobile */}
              <div
                className={cn(
                  "pt-6 pb-4",
                  "sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent",
                  "-mx-6 px-6 lg:mx-0 lg:px-0 lg:bg-transparent lg:static"
                )}
              >
                <div className="flex flex-col-reverse sm:flex-row gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    size="lg"
                    onClick={() => navigate(ROUTES.TABLES)}
                    disabled={isPending}
                    className="min-h-[52px] sm:min-w-[120px]"
                  >
                    Cancelar
                  </Button>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={isPending}
                    disabled={isPending || !isValid}
                    className="min-h-[52px] flex-1 sm:flex-initial"
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

        {/* Preview Section - Sticky on Desktop */}
        <div
          className={cn(
            "lg:w-[400px] xl:w-[480px]",
            "bg-sage-50/50 border-t lg:border-t-0 lg:border-l border-sage-200/60",
            "p-6 lg:p-8",
            "lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto"
          )}
        >
          <div className="lg:pt-4">
            {/* Preview Header */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-carbon-500 uppercase tracking-wider">
                Vista Previa
              </h3>
              <p className="text-xs text-carbon-400 mt-1">
                Actualización en tiempo real
              </p>
            </div>

            {/* Preview Card */}
            <TablePreview
              tableData={{
                number: number || "",
                location: location || "",
                status: status,
              }}
            />

            {/* Tips */}
            <div className="mt-8 p-4 bg-white/60 rounded-xl border border-sage-200/40">
              <h4 className="text-sm font-medium text-carbon-700 mb-2">
                Consejos
              </h4>
              <ul className="text-xs text-carbon-500 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-sage-500 mt-0.5">•</span>
                  Usa nombres únicos y fáciles de recordar
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sage-500 mt-0.5">•</span>
                  La ubicación ayuda al personal a encontrar la mesa
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sage-500 mt-0.5">•</span>
                  El estado se puede cambiar después
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
