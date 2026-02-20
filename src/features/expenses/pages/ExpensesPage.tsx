import React, { useState } from "react";
import { Plus, Receipt } from "lucide-react";
import { ExpenseList } from "../components/ExpenseList";
import { ExpenseFormModal } from "../components/ExpenseFormModal";

/**
 * EXPENSES PAGE
 * Quick management and recording of business expenses.
 */
export const ExpensesPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6 p-4 max-w-5xl mx-auto">
      <header className="flex justify-between items-end">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary-600">
            <Receipt className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-wider">Administración</span>
          </div>
          <h1 className="text-3xl font-black text-carbon-900">Gastos</h1>
          <p className="text-carbon-500 font-medium">Gestiona tus egresos y compras del día</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3.5 bg-primary-600 text-white rounded-2xl font-bold hover:bg-primary-700 transition-all active:scale-95 shadow-lg shadow-primary-100"
        >
          <Plus className="w-5 h-5" />
          Registrar Gasto
        </button>
      </header>
      
      <div className="pt-2">
        <ExpenseList />
      </div>

      <ExpenseFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};
