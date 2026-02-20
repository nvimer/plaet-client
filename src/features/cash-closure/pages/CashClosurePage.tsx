import React from "react";

/**
 * CASH CLOSURE PAGE
 * Handles opening and closing of cash drawer shifts.
 */
export const CashClosurePage: React.FC = () => {
  return (
    <div className="space-y-6 p-4">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-carbon-900">Cuadre de Caja</h1>
          <p className="text-carbon-500">Gestionar apertura y cierre de turnos</p>
        </div>
      </header>
      
      <div className="bg-white rounded-2xl shadow-sm border border-sage-100 p-8 flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center">
          <span className="text-2xl">💰</span>
        </div>
        <h2 className="text-xl font-semibold text-carbon-800">Caja Cerrada</h2>
        <p className="text-carbon-500 text-center max-w-sm">
          No hay un turno activo. Inicia el turno ingresando la base de caja inicial.
        </p>
        <button className="px-6 py-2.5 bg-sage-600 text-white rounded-xl font-medium hover:bg-sage-700 transition-colors">
          Abrir Turno
        </button>
      </div>
    </div>
  );
};
