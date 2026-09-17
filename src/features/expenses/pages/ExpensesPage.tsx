import { Button, Skeleton } from "@/components";
import React, { useMemo, useState } from "react";
import { Plus, History, Wallet, Filter, ReceiptText } from "lucide-react";
import { ExpenseList } from "../components/ExpenseList";
import { ExpenseFormModal } from "../components/ExpenseFormModal";
import { SidebarLayout } from "@/layouts/SidebarLayout";
import { useExpenses } from "../hooks/useExpenses";

/**
 * EXPENSES PAGE
 * Quick management and recording of business expenses.
 * Refined with professional minimalist design.
 */
export const ExpensesPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { todayStartISO, weekStartISO, nowISO } = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 6);
    return {
      todayStartISO: todayStart.toISOString(),
      weekStartISO: weekStart.toISOString(),
      nowISO: now.toISOString(),
    };
  }, []);

  const { expenses: todayExpenses, isLoading: isLoadingToday } = useExpenses(todayStartISO, nowISO);
  const { expenses: weekExpenses, isLoading: isLoadingWeek } = useExpenses(weekStartISO, nowISO);
  const { expenses: allExpenses } = useExpenses();

  const todayTotal = todayExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const weekTotal = weekExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const categoryCount = new Set(allExpenses.map((e) => e.category)).size;

  return (
    <SidebarLayout hideTitle fullWidth>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 pb-24">
        {/* Header with main CTA */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sage-600">
              <ReceiptText className="w-5 h-5" />
              <span className="text-[10px] font-semibold tracking-[0.2em]">Tesorería y Compras</span>
            </div>
            <h1 className="text-4xl font-bold text-carbon-900 tracking-tight">Gastos y Egresos</h1>
            <p className="text-lg text-carbon-500 font-medium">Control de compras y pagos operativos del restaurante.</p>
          </div>

          <Button
            onClick={() => setIsModalOpen(true)}
            variant="primary"
            size="lg"
            className="rounded-2xl h-14 px-8 shadow-soft-lg transition-all active:scale-95 font-bold"
          >
            <Plus className="w-5 h-5 mr-2 stroke-[3px]" />
            Registrar Gasto
          </Button>
        </header>

        {/* Stats Grid for Expenses */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-sage-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-error-50 text-error-600 flex items-center justify-center">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-carbon-400 tracking-wide">Hoy en Egresos</p>
              {isLoadingToday ? (
                <Skeleton variant="text" width={90} />
              ) : (
                <p className="text-xl font-bold text-carbon-900">${todayTotal.toLocaleString("es-CO")}</p>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-sage-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-info-50 text-info-600 flex items-center justify-center">
              <History className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-carbon-400 tracking-wide">Últimos 7 días</p>
              {isLoadingWeek ? (
                <Skeleton variant="text" width={90} />
              ) : (
                <p className="text-xl font-bold text-carbon-900">${weekTotal.toLocaleString("es-CO")}</p>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-sage-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-warning-50 text-warning-600 flex items-center justify-center">
              <Filter className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-carbon-400 tracking-wide">Categorización</p>
              <p className="text-xl font-bold text-carbon-900">{categoryCount} {categoryCount === 1 ? "rubro" : "rubros"}</p>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <ExpenseList />
        </div>

        <ExpenseFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </SidebarLayout>
  );
};
