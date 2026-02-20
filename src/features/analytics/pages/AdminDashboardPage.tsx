import React from "react";

/**
 * ADMIN DASHBOARD PAGE
 * Main administrative view with sales and performance charts.
 */
export const AdminDashboardPage: React.FC = () => {
  return (
    <div className="space-y-6 p-4">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-carbon-900">Estadísticas</h1>
          <p className="text-carbon-500">Resumen de ventas y rentabilidad</p>
        </div>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder for KPI cards */}
        <div className="h-32 bg-white rounded-2xl shadow-sm border border-sage-100 flex items-center justify-center text-carbon-400">
          KPI Card Placeholder
        </div>
        <div className="h-32 bg-white rounded-2xl shadow-sm border border-sage-100 flex items-center justify-center text-carbon-400">
          KPI Card Placeholder
        </div>
        <div className="h-32 bg-white rounded-2xl shadow-sm border border-sage-100 flex items-center justify-center text-carbon-400">
          KPI Card Placeholder
        </div>
      </div>
      
      {/* Placeholder for chart */}
      <div className="h-80 bg-white rounded-2xl shadow-sm border border-sage-100 flex items-center justify-center text-carbon-400">
        Recharts Placeholder
      </div>
    </div>
  );
};
