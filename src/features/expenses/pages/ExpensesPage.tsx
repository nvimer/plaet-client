import React from "react";

/**
 * EXPENSES PAGE
 * Quick management and recording of business expenses.
 */
export const ExpensesPage: React.FC = () => {
  return (
    <div className="space-y-6 p-4">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-carbon-900">Gastos</h1>
          <p className="text-carbon-500">Registro de egresos y compras</p>
        </div>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors">
          Nuevo Gasto
        </button>
      </header>
      
      <div className="bg-white rounded-2xl shadow-sm border border-sage-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-sage-50 text-carbon-600 text-sm uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-semibold">Fecha</th>
              <th className="px-6 py-4 font-semibold">Descripción</th>
              <th className="px-6 py-4 font-semibold">Categoría</th>
              <th className="px-6 py-4 font-semibold text-right">Monto</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sage-100 text-carbon-800">
            <tr>
              <td colSpan={4} className="px-6 py-12 text-center text-carbon-400 italic">
                No hay gastos registrados para el periodo seleccionado.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
