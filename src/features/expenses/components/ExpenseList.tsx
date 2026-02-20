import React from "react";
import { Trash2, Receipt, Calendar } from "lucide-react";
import { useExpenses } from "../hooks/useExpenses";
import { Skeleton } from "@/components/ui/Skeleton/Skeleton";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog/ConfirmDialog";

/**
 * EXPENSE LIST
 * Table showing recorded expenses for the current period.
 */
export const ExpenseList: React.FC = () => {
  const { expenses, isLoading, deleteExpense } = useExpenses();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-dashed border-sage-200 p-12 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 bg-sage-50 rounded-full flex items-center justify-center text-sage-300">
          <Receipt className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-carbon-800">Sin Gastos</h3>
          <p className="text-carbon-400 max-w-xs">Aún no has registrado ningún gasto en este periodo.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-sage-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-sage-50 text-carbon-500 text-xs uppercase tracking-wider font-black">
            <tr>
              <th className="px-6 py-4">Concepto</th>
              <th className="px-6 py-4">Categoría</th>
              <th className="px-6 py-4">Fecha</th>
              <th className="px-6 py-4 text-right">Monto</th>
              <th className="px-6 py-4 w-16"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sage-50">
            {expenses.map((expense) => (
              <tr key={expense.id} className="group hover:bg-sage-50/50 transition-colors">
                <td className="px-6 py-5">
                  <p className="font-bold text-carbon-900">{expense.description}</p>
                </td>
                <td className="px-6 py-5">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white border border-sage-200 text-carbon-600">
                    {expense.category}
                  </span>
                </td>
                <td className="px-6 py-5 text-carbon-500 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(expense.date).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <p className="font-black text-carbon-900">${expense.amount.toLocaleString()}</p>
                </td>
                <td className="px-6 py-5 text-right">
                  <ConfirmDialog
                    title="¿Eliminar gasto?"
                    description="Esta acción no se puede deshacer y afectará el balance neto."
                    onConfirm={() => deleteExpense(expense.id)}
                    trigger={
                      <button className="p-2 text-carbon-300 hover:text-error-500 hover:bg-error-50 rounded-xl transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    }
                    confirmText="Eliminar"
                    cancelText="No, mantener"
                    variant="danger"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
