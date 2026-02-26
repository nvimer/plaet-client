import React, { useState } from "react";
import { Plus, Receipt, History, Wallet, Filter } from "lucide-react";
import { ExpenseList } from "../components/ExpenseList";
import { ExpenseFormModal } from "../components/ExpenseFormModal";
import { SidebarLayout } from "@/layouts/SidebarLayout";
import { Button } from "@/components";

/**
 * EXPENSES PAGE
 * Quick management and recording of business expenses.
 * Refined with professional minimalist design.
 */
export const ExpensesPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <SidebarLayout
      title="Gastos y Egresos"
      subtitle="Control de compras y pagos del día"
      actions={
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="rounded-xl shadow-soft-md"
        >
          <Plus className="w-4 h-4 mr-2" />
          Registrar Gasto
        </Button>
      }
    >
      <div className="max-w-5xl mx-auto space-y-8">
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

        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-bold text-carbon-900 text-lg">Registro de Movimientos</h2>
          </div>
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