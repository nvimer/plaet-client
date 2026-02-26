import React from "react";
import { Trash2, Receipt, Calendar, User, Tag, ArrowDownCircle } from "lucide-react";
import { useExpenses } from "../hooks/useExpenses";
import { Skeleton } from "@/components/ui/Skeleton/Skeleton";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog/ConfirmDialog";
import { cn } from "@/utils/cn";

/**
 * EXPENSE LIST
 * Modern list showing recorded expenses with professional minimalist design.
 */
export const ExpenseList: React.FC = () => {
  const { expenses, isLoading, deleteExpense } = useExpenses();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!Array.isArray(expenses) || expenses.length === 0) {
    return (
      <div className="bg-white rounded-3xl border-2 border-dashed border-sage-200 p-16 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-20 h-20 bg-sage-50 rounded-3xl flex items-center justify-center text-sage-300 shadow-inner">
          <Receipt className="w-10 h-10" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-carbon-800 tracking-tight">Sin egresos registrados</h3>
          <p className="text-carbon-400 max-w-xs mt-1">Registra las compras o pagos del día para mantener el balance de caja al día.</p>
        </div>
      </div>
    );
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "insumos": return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "servicios": return "bg-blue-50 text-blue-700 border-blue-100";
      case "nómina": return "bg-purple-50 text-purple-700 border-purple-100";
      case "mantenimiento": return "bg-amber-50 text-amber-700 border-amber-100";
      default: return "bg-carbon-50 text-carbon-600 border-carbon-100";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
      {expenses.map((expense) => (
        <div 
          key={expense.id} 
          className="bg-white rounded-2xl border-2 border-sage-100 p-5 shadow-sm hover:border-sage-300 hover:shadow-soft-md transition-all duration-300 group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-error-50 text-error-600 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                <ArrowDownCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-carbon-900 tracking-tight leading-tight">{expense.description}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-lg border uppercase tracking-wider",
                    getCategoryColor(expense.category)
                  )}>
                    {expense.category}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-carbon-900 tracking-tight">
                ${Number(expense.amount).toLocaleString("es-CO")}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-sage-50 mt-2">
            <div className="flex flex-wrap gap-4 text-[11px] font-medium text-carbon-400 uppercase tracking-widest">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(expense.date).toLocaleDateString("es-CO", { day: 'numeric', month: 'short' })}
              </div>
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                {expense.registeredBy?.name || "Cajero"}
              </div>
            </div>

            <ConfirmDialog
              title="Eliminar registro"
              description="¿Estás seguro de eliminar este gasto? El balance de caja se ajustará automáticamente."
              onConfirm={() => deleteExpense(expense.id)}
              trigger={
                <button className="p-2 text-carbon-300 hover:text-error-500 hover:bg-error-50 rounded-xl transition-all active:scale-90">
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              }
              confirmText="Eliminar"
              cancelText="Mantener"
              variant="danger"
            />
          </div>
        </div>
      ))}
    </div>
  );
};