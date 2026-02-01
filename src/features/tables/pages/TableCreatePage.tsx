import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TableStatus } from "@/types";
import type { AxiosErrorWithResponse } from "@/types/common";
import { FullScreenLayout } from "@/layouts/FullScreenLayout";
import { Button, Input, Card } from "@/components";
import { useCreateTable } from "../hooks";
import {
  createTableSchema,
  type CreateTableInput,
} from "../schemas/tableSchemas";
import { ROUTES } from "@/app/routes";
import { toast } from "sonner";
import {
  Check,
  MapPin,
  Hash,
  Sparkles,
  Eye,
  CircleCheck,
  CircleAlert,
  Loader2,
} from "lucide-react";
import { cn } from "@/utils/cn";

/**
 * TableCreatePage Component
 *
 * Modern table creation page following 2025 UX best practices:
 * - Real-time preview
 * - Immediate validation feedback
 * - Micro-interactions and animations
 * - Touch-friendly targets (44px minimum)
 * - Clear visual hierarchy
 * - Accessibility compliant (WCAG 2.2)
 *
 * @see claude.md for design system rules
 */
export function TableCreatePage() {
  const navigate = useNavigate();
  const { mutate: createTable, isPending } = useCreateTable();
  const [isFormTouched, setIsFormTouched] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, dirtyFields },
    watch,
  } = useForm<CreateTableInput>({
    resolver: zodResolver(createTableSchema),
    defaultValues: {
      number: "",
      location: "",
      status: TableStatus.AVAILABLE,
    },
    mode: "onChange", // Real-time validation (claude.md: Form Patterns)
  });

  // Watch form values for real-time preview
  const formValues = watch();

  // Track if form has been interacted with
  useEffect(() => {
    if (Object.keys(dirtyFields).length > 0) {
      setIsFormTouched(true);
    }
  }, [dirtyFields]);

  const onSubmit = (data: CreateTableInput) => {
    createTable(data, {
      onSuccess: () => {
        // Success toast (claude.md: Toast Notifications)
        toast.success("¡Mesa creada exitosamente!", {
          description: `La mesa #${data.number} está lista para usar`,
          icon: "🎉",
          duration: 4000,
        });
        navigate(ROUTES.TABLES);
      },
      onError: (error: AxiosErrorWithResponse) => {
        // Error toast with detailed message
        toast.error("Error al crear la mesa", {
          description: error.response?.data?.message || error.message,
          icon: "❌",
          duration: 5000,
        });
      },
    });
  };

  // Status options with semantic colors
  const statusOptions = [
    {
      value: TableStatus.AVAILABLE,
      label: "Disponible",
      description: "Lista para recibir clientes",
      icon: "✅",
      color: "bg-success-50 border-success-300 text-success-700",
      activeRing: "ring-success-200",
    },
    {
      value: TableStatus.OCCUPIED,
      label: "Ocupada",
      description: "Actualmente en uso",
      icon: "🍽️",
      color: "bg-error-50 border-error-300 text-error-700",
      activeRing: "ring-error-200",
    },
    {
      value: TableStatus.NEEDS_CLEANING,
      label: "Necesita Limpieza",
      description: "Requiere limpieza antes de uso",
      icon: "🧹",
      color: "bg-warning-50 border-warning-300 text-warning-700",
      activeRing: "ring-warning-200",
    },
  ];

  // Determine preview status styling
  const getStatusConfig = (status: TableStatus) => {
    return statusOptions.find((opt) => opt.value === status) || statusOptions[0];
  };

  const currentStatus = getStatusConfig(formValues.status);

  return (
    <FullScreenLayout
      title="Nueva Mesa"
      subtitle="Configura los detalles de la nueva mesa"
      backRoute={ROUTES.TABLES}
    >
      {/* Main Grid Layout - Form + Preview (claude.md: Responsive Design) */}
      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form Section - 3 columns on large screens */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <Card variant="elevated" padding="lg">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Section: Basic Information */}
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-sage-green-100 flex items-center justify-center">
                      <Hash className="w-5 h-5 text-sage-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-carbon-900">
                        Información Básica
                      </h3>
                      <p className="text-sm text-carbon-500 font-light">
                        Número identificador y ubicación
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Table Number Input - Primary field */}
                    <div className="relative">
                      <Input
                        label="Número de Mesa"
                        type="text"
                        placeholder="Ej: 1, 2, 3, A1, B2..."
                        {...register("number")}
                        error={errors.number?.message}
                        helperText="Identificador único de la mesa"
                        fullWidth
                        autoFocus
                        aria-describedby="number-validation"
                      />
                      {/* Validation indicator (claude.md: Micro-interactions) */}
                      {dirtyFields.number && (
                        <div
                          id="number-validation"
                          className={cn(
                            "absolute right-3 top-9 transition-all duration-200",
                            errors.number
                              ? "text-error-500"
                              : "text-success-500"
                          )}
                        >
                          {errors.number ? (
                            <CircleAlert className="w-5 h-5 animate-bounce-in" />
                          ) : (
                            <CircleCheck className="w-5 h-5 animate-scale-in" />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Location Input - Optional field */}
                    <div className="relative">
                      <Input
                        label="Ubicación"
                        type="text"
                        placeholder="Ej: Entrada, Terraza, Ventana, VIP..."
                        {...register("location")}
                        error={errors.location?.message}
                        helperText="Opcional: Ayuda a identificar la mesa"
                        fullWidth
                        aria-describedby="location-help"
                      />
                      {/* Location icon indicator */}
                      {formValues.location && (
                        <div className="absolute right-3 top-9 text-sage-green-500 transition-all duration-200">
                          <MapPin className="w-5 h-5 animate-fade-in" />
                        </div>
                      )}
                    </div>
                  </div>
                </section>

                {/* Divider */}
                <hr className="border-sage-border-subtle" />

                {/* Section: Initial Status */}
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-sage-green-100 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-sage-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-carbon-900">
                        Estado Inicial
                      </h3>
                      <p className="text-sm text-carbon-500 font-light">
                        Disponibilidad al crear la mesa
                      </p>
                    </div>
                  </div>

                  {/* Status Options - Touch-friendly (claude.md: min 44px) */}
                  <div className="grid gap-3">
                    {statusOptions.map((option) => {
                      const isSelected = formValues.status === option.value;
                      return (
                        <label
                          key={option.value}
                          className={cn(
                            // Base styles (claude.md: Component Guidelines)
                            "flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer",
                            "transition-all duration-200 min-h-[56px]", // 56px > 44px minimum
                            // Selected state
                            isSelected
                              ? `${option.color} ring-2 ${option.activeRing} scale-[1.02]`
                              : "bg-white border-carbon-200 hover:border-sage-green-300 hover:bg-sage-50",
                            // Focus visible (claude.md: Accessibility)
                            "focus-within:ring-2 focus-within:ring-sage-green-300 focus-within:ring-offset-2"
                          )}
                        >
                          <input
                            type="radio"
                            value={option.value}
                            {...register("status")}
                            className="sr-only" // Hidden but accessible
                          />
                          {/* Icon */}
                          <span className="text-2xl" role="img" aria-hidden="true">
                            {option.icon}
                          </span>
                          {/* Content */}
                          <div className="flex-1">
                            <div className="font-semibold text-carbon-900">
                              {option.label}
                            </div>
                            <div className="text-sm text-carbon-500 font-light">
                              {option.description}
                            </div>
                          </div>
                          {/* Selected indicator */}
                          {isSelected && (
                            <Check className="w-5 h-5 text-current animate-scale-in" />
                          )}
                        </label>
                      );
                    })}
                  </div>
                </section>

                {/* Divider */}
                <hr className="border-sage-border-subtle" />

                {/* Action Buttons (claude.md: Button Guidelines) */}
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  {/* Primary CTA - Only one per view */}
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={isPending}
                    disabled={isPending || !isValid}
                    fullWidth
                    className="order-1"
                    aria-label="Crear nueva mesa"
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

                  {/* Secondary action */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="lg"
                    onClick={() => navigate(ROUTES.TABLES)}
                    disabled={isPending}
                    fullWidth
                    className="order-2 sm:order-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Preview Section - 2 columns on large screens */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="lg:sticky lg:top-24">
              {/* Preview Card */}
              <Card variant="bordered" padding="none" className="overflow-hidden">
                {/* Preview Header */}
                <div className="bg-sage-50 px-6 py-4 border-b border-sage-border-subtle">
                  <div className="flex items-center gap-2 text-carbon-600">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm font-medium">Vista Previa</span>
                  </div>
                </div>

                {/* Preview Content */}
                <div className="p-6">
                  {/* Table Visual Representation */}
                  <div
                    className={cn(
                      "aspect-square max-w-[200px] mx-auto rounded-2xl",
                      "border-4 flex flex-col items-center justify-center",
                      "transition-all duration-300",
                      // Dynamic styling based on status
                      formValues.status === TableStatus.AVAILABLE &&
                        "bg-success-50 border-success-300",
                      formValues.status === TableStatus.OCCUPIED &&
                        "bg-error-50 border-error-300",
                      formValues.status === TableStatus.NEEDS_CLEANING &&
                        "bg-warning-50 border-warning-300"
                    )}
                  >
                    {/* Table Number */}
                    <span
                      className={cn(
                        "text-5xl font-bold transition-all duration-300",
                        formValues.number ? "opacity-100" : "opacity-30"
                      )}
                    >
                      {formValues.number || "#"}
                    </span>

                    {/* Status Badge */}
                    <div
                      className={cn(
                        "mt-3 px-3 py-1 rounded-full text-xs font-semibold",
                        "transition-all duration-300",
                        currentStatus.color
                      )}
                    >
                      {currentStatus.icon} {currentStatus.label}
                    </div>
                  </div>

                  {/* Preview Details */}
                  <div className="mt-6 space-y-3">
                    {/* Number */}
                    <div className="flex items-center justify-between py-2 border-b border-sage-border-subtle">
                      <span className="text-sm text-carbon-500">Número</span>
                      <span
                        className={cn(
                          "font-semibold transition-all duration-200",
                          formValues.number
                            ? "text-carbon-900"
                            : "text-carbon-300"
                        )}
                      >
                        {formValues.number || "Sin asignar"}
                      </span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center justify-between py-2 border-b border-sage-border-subtle">
                      <span className="text-sm text-carbon-500">Ubicación</span>
                      <span
                        className={cn(
                          "font-semibold transition-all duration-200",
                          formValues.location
                            ? "text-carbon-900"
                            : "text-carbon-300"
                        )}
                      >
                        {formValues.location || "Sin especificar"}
                      </span>
                    </div>

                    {/* Status */}
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-carbon-500">Estado</span>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-lg text-sm font-semibold",
                          currentStatus.color
                        )}
                      >
                        {currentStatus.label}
                      </span>
                    </div>
                  </div>

                  {/* Validation Summary */}
                  {isFormTouched && (
                    <div
                      className={cn(
                        "mt-6 p-4 rounded-xl transition-all duration-300",
                        isValid
                          ? "bg-success-50 border border-success-200"
                          : "bg-warning-50 border border-warning-200"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {isValid ? (
                          <>
                            <CircleCheck className="w-5 h-5 text-success-600" />
                            <span className="text-sm font-medium text-success-700">
                              ¡Listo para crear!
                            </span>
                          </>
                        ) : (
                          <>
                            <CircleAlert className="w-5 h-5 text-warning-600" />
                            <span className="text-sm font-medium text-warning-700">
                              Completa los campos requeridos
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Quick Tips */}
              <div className="mt-4 p-4 bg-info-50 rounded-xl border border-info-200">
                <p className="text-sm text-info-700">
                  <span className="font-semibold">💡 Consejo:</span> Usa números
                  simples (1, 2, 3) o códigos de zona (A1, B2) para facilitar la
                  identificación.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FullScreenLayout>
  );
}
