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
 * Sage Japanese Style (Wabi-Sabi):
 * - Ma (間): Generous whitespace, breathing room
 * - Kanso (簡素): Simplicity, only essential elements
 * - Shizen (自然): Natural colors, organic feel
 * - Shibui (渋い): Subtle elegance
 *
 * UX Best Practices 2025:
 * - Touch-friendly targets (min 48px)
 * - Real-time preview
 * - Immediate validation feedback
 * - Sidebar always accessible
 *
 * @see claude.md for design system rules
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

  // Watch for real-time preview
  const formValues = watch();

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

  // Status options - Touch-friendly cards
  const statusOptions = [
    {
      value: TableStatus.AVAILABLE,
      label: "Disponible",
      description: "Lista para clientes",
      emoji: "🟢",
    },
    {
      value: TableStatus.OCCUPIED,
      label: "Ocupada",
      description: "En uso",
      emoji: "🔴",
    },
    {
      value: TableStatus.NEEDS_CLEANING,
      label: "Limpieza",
      description: "Requiere limpieza",
      emoji: "🟡",
    },
  ];

  return (
    <SidebarLayout
      title="Nueva Mesa"
      subtitle="Agrega una nueva mesa al restaurante"
      backRoute={ROUTES.TABLES}
    >
      {/* Main Grid - Form + Preview */}
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Form Section */}
        <div className="order-2 lg:order-1">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Section: Basic Info */}
            <Card variant="default" padding="lg" className="space-y-6">
              {/* Section Header - Minimal */}
              <div className="pb-4 border-b border-sage-200/50">
                <h2 className="text-lg font-medium text-carbon-800">
                  Información
                </h2>
              </div>

              {/* Table Number - Primary field */}
              <div>
                <Input
                  label="Número de Mesa"
                  type="text"
                  placeholder="Ej: 1, 2, A1..."
                  {...register("number")}
                  error={errors.number?.message}
                  fullWidth
                  autoFocus
                  className="text-lg"
                />
              </div>

              {/* Location - Optional */}
              <div>
                <Input
                  label="Ubicación"
                  type="text"
                  placeholder="Ej: Terraza, Ventana, Interior..."
                  {...register("location")}
                  error={errors.location?.message}
                  helperText="Opcional"
                  fullWidth
                />
              </div>
            </Card>

            {/* Section: Status */}
            <Card variant="default" padding="lg" className="space-y-6">
              {/* Section Header */}
              <div className="pb-4 border-b border-sage-200/50">
                <h2 className="text-lg font-medium text-carbon-800">
                  Estado Inicial
                </h2>
              </div>

              {/* Status Options - Touch-friendly (min 56px height) */}
              <div className="grid gap-3">
                {statusOptions.map((option) => {
                  const isSelected = formValues.status === option.value;
                  return (
                    <label
                      key={option.value}
                      className={cn(
                        // Base - Touch-friendly
                        "flex items-center gap-4 p-4 rounded-xl cursor-pointer",
                        "min-h-[60px]", // Touch target > 48px
                        "border-2 transition-all duration-200",
                        // States
                        isSelected
                          ? "border-sage-green-400 bg-sage-green-50/50"
                          : "border-sage-200 bg-white hover:border-sage-300 hover:bg-sage-50/30",
                        // Focus
                        "focus-within:ring-2 focus-within:ring-sage-green-300 focus-within:ring-offset-2"
                      )}
                    >
                      <input
                        type="radio"
                        value={option.value}
                        {...register("status")}
                        className="sr-only"
                      />
                      
                      {/* Emoji indicator */}
                      <span className="text-2xl" aria-hidden="true">
                        {option.emoji}
                      </span>
                      
                      {/* Label */}
                      <div className="flex-1">
                        <div className="font-medium text-carbon-800">
                          {option.label}
                        </div>
                        <div className="text-sm text-carbon-500">
                          {option.description}
                        </div>
                      </div>
                      
                      {/* Selected indicator */}
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-sage-green-500 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </label>
                  );
                })}
              </div>
            </Card>

            {/* Actions - Sticky on mobile */}
            <div className="sticky bottom-6 pt-4">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Primary CTA - Touch-friendly */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isPending}
                  disabled={isPending || !isValid}
                  fullWidth
                  className="min-h-[52px] text-base"
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

                {/* Cancel */}
                <Button
                  type="button"
                  variant="ghost"
                  size="lg"
                  onClick={() => navigate(ROUTES.TABLES)}
                  disabled={isPending}
                  className="min-h-[52px] sm:w-auto"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </form>
        </div>

        {/* Preview Section - Sticky */}
        <div className="order-1 lg:order-2">
          <div className="lg:sticky lg:top-24">
            <TablePreview
              tableData={{
                number: formValues.number,
                location: formValues.location,
                status: formValues.status,
              }}
            />
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
