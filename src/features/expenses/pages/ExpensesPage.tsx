import React, { useState } from "react";
import { Plus, History, Wallet, Filter } from "lucide-react";
import { ExpenseList } from "../components/ExpenseList";
import { ExpenseFormModal } from "../components/ExpenseFormModal";
import { Button } from "@/components";
import { SidebarLayout } from "@/layouts/SidebarLayout";

/**
 * EXPENSES PAGE
 * Quick management and recording of business expenses.
 * Refined with professional minimalist design.
 */
export const ExpensesPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <SidebarLayout hideTitle fullWidth>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-12 py-6">
        {/* Header with main CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="font-bold text-carbon-900 text-2xl tracking-tight">Gastos y Egresos</h2>
            <p className="text-sm text-carbon-500 font-medium">Control de compras y pagos del día</p>
          </div>
          
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="rounded-2xl h-14 px-8 shadow-soft-lg transition-all active:scale-95"
          >
            <Plus className="w-5 h-5 mr-2 stroke-[3px]" />
            Registrar Gasto
          </Button>
        </div>

        {/* Stats Grid for Expenses */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-sage-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-error-50 text-error-600 flex items-center justify-center">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-carbon-400 uppercase tracking-widest">Hoy en Egresos</p>
              <p className="text-xl font-bold text-carbon-900">Historial Reciente</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-sage-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-info-50 text-info-600 flex items-center justify-center">
              <History className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-carbon-400 uppercase tracking-widest">Últimos 7 días</p>
              <p className="text-xl font-bold text-carbon-900">Control de Caja</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-sage-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-warning-50 text-warning-600 flex items-center justify-center">
              <Filter className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-carbon-400 uppercase tracking-widest">Categorización</p>
              <p className="text-xl font-bold text-carbon-900">Detalle por Rubro</p>
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