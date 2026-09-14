import { BaseModal, Button } from "@/components";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useExpenses } from "../hooks/useExpenses";
import { ShoppingCart, Zap, Users, Wrench, Package, Check, X, Calculator, AlertCircle } from "lucide-react";
import { cn } from "@/utils/cn";

const expenseFormSchema = z.object({
  amount: z.coerce
    .number({ invalid_type_error: "Ingresa un monto válido" })
    .positive("El monto debe ser mayor a 0"),
  description: z.string().min(1, "La descripción es obligatoria").max(255),
  category: z.string().min(1, "Selecciona una categoría"),
});

type ExpenseFormData = z.infer<typeof expenseFormSchema>;

interface ExpenseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const categories = [
  { name: "Insumos", icon: ShoppingCart, color: "text-success-600", bg: "bg-success-50" },
  { name: "Servicios", icon: Zap, color: "text-blue-600", bg: "bg-blue-50" },
  { name: "Nómina", icon: Users, color: "text-info-600", bg: "bg-info-50" },
  { name: "Mantenimiento", icon: Wrench, color: "text-warning-600", bg: "bg-warning-50" },
  { name: "Otros", icon: Package, color: "text-carbon-600", bg: "bg-carbon-50" },
];

/**
 * EXPENSE FORM MODAL
 * Refined form to record business expenses with professional aesthetic.
 */
export const ExpenseFormModal: React.FC<ExpenseFormModalProps> = ({ isOpen, onClose }) => {
  const { createExpense, isCreating } = useExpenses();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      amount: undefined,
      description: "",
      category: "Insumos",
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({ amount: undefined, description: "", category: "Insumos" });
    }
  }, [isOpen, reset]);

  const selectedCategory = watch("category");

  const onSubmit = (data: ExpenseFormData) => {
    createExpense(
      {
        amount: data.amount,
        description: data.description,
        category: data.category,
      },
      {
        onSuccess: () => {
          reset({ amount: undefined, description: "", category: "Insumos" });
          onClose();
        },
      }
    );
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Registrar Egreso"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Amount Input - Prominent */}
        <div className="space-y-3">
          <label htmlFor="expense-amount" className="text-sm font-bold text-carbon-700 ml-1">Monto del Gasto</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-carbon-400 font-bold text-2xl">$</span>
            <input
              id="expense-amount"
              type="number"
              step="0.01"
              placeholder="0"
              autoFocus
              aria-invalid={!!errors.amount}
              aria-describedby={errors.amount ? "expense-amount-error" : undefined}
              className={cn(
                "w-full h-16 pl-10 pr-4 rounded-2xl border-2 focus:ring-0 text-3xl font-black text-carbon-900 transition-all placeholder:text-carbon-200",
                errors.amount ? "border-error-400 focus:border-error-500" : "border-carbon-100 focus:border-error-500"
              )}
              {...register("amount")}
            />
          </div>
          {errors.amount && (
            <p id="expense-amount-error" className="text-sm text-error-600 flex items-center gap-1.5 font-bold ml-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.amount.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-3">
          <label htmlFor="expense-description" className="text-sm font-bold text-carbon-700 ml-1">Concepto / Descripción</label>
          <input
            id="expense-description"
            type="text"
            placeholder="Ej: Compra de carne, Pago de energía..."
            aria-invalid={!!errors.description}
            aria-describedby={errors.description ? "expense-description-error" : undefined}
            className={cn(
              "w-full h-14 px-4 rounded-xl border-2 focus:ring-0 text-base font-medium transition-all",
              errors.description ? "border-error-400 focus:border-error-500" : "border-carbon-100 focus:border-sage-500"
            )}
            {...register("description")}
          />
          {errors.description && (
            <p id="expense-description-error" className="text-sm text-error-600 flex items-center gap-1.5 font-bold ml-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Category Selection */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-carbon-700 ml-1">Categoría</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => setValue("category", cat.name, { shouldValidate: true, shouldDirty: true })}
                  aria-pressed={isActive}
                  className={cn(
                    "flex items-center gap-2 px-3 py-3 rounded-xl border-2 transition-all duration-200",
                    isActive
                      ? "bg-carbon-900 border-carbon-900 text-white shadow-md"
                      : "bg-white border-carbon-100 text-carbon-500 hover:border-sage-300"
                  )}
                >
                  <Icon className={cn("w-4 h-4", isActive ? "text-sage-400" : cat.color)} />
                  <span className="text-xs font-medium tracking-tight">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Notice Info */}
        <div className="bg-warning-50 p-4 rounded-2xl border border-warning-100 flex gap-3">
          <Calculator className="w-5 h-5 text-warning-600 shrink-0" />
          <p className="text-xs text-warning-800 font-medium leading-relaxed">
            Este gasto se restará automáticamente del balance esperado al momento de realizar el <strong>Cierre de Caja</strong> del turno actual.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            variant="ghost"
            type="button"
            onClick={onClose}
            disabled={isCreating}
            className="h-14 rounded-2xl font-bold text-carbon-400"
          >
            <X className="w-5 h-5 mr-2" />
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isCreating}
            className="h-14 rounded-2xl font-black bg-carbon-900 hover:bg-carbon-800 text-white shadow-xl shadow-carbon-200"
          >
            {isCreating ? "Registrando..." : (
              <>
                <Check className="w-5 h-5 mr-2 stroke-[3px]" />
                Guardar Gasto
              </>
            )}
          </Button>
        </div>
      </form>
    </BaseModal>
  );
};
