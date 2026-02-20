import React, { useState } from "react";
import { useAnalytics } from "../hooks/useAnalytics";
import { StatsGrid } from "../components/StatsGrid";
import { SalesOverviewChart } from "../components/SalesOverviewChart";
import { TopProductsChart } from "../components/TopProductsChart";
import { Skeleton } from "@/components/ui/Skeleton/Skeleton";
import { BarChart3, Calendar, RefreshCcw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button/Button";

/**
 * ADMIN DASHBOARD PAGE
 * Main administrative view with sales and performance charts.
 */
export const AdminDashboardPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const { dailySummary, topProducts, isLoading, isError, refetch } = useAnalytics(selectedDate);

  if (isLoading) {
    return (
      <div className="space-y-8 p-4 max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <Skeleton className="h-12 w-64 rounded-xl" />
          <Skeleton className="h-10 w-40 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full rounded-3xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-[400px] w-full rounded-3xl" />
          <Skeleton className="h-[400px] w-full rounded-3xl" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <AlertTriangle className="w-12 h-12 text-error-500" />
        <h2 className="text-xl font-bold text-carbon-900">Error al cargar estadísticas</h2>
        <Button onClick={() => refetch()} variant="outline" className="gap-2">
          <RefreshCcw className="w-4 h-4" /> Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 max-w-7xl mx-auto pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary-600">
            <BarChart3 className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-wider">Administración</span>
          </div>
          <h1 className="text-3xl font-black text-carbon-900">Estadísticas</h1>
          <p className="text-carbon-500 font-medium">Control de ingresos y rendimiento comercial</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-sage-100">
          <Calendar className="w-5 h-5 text-carbon-400 ml-2" />
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent border-none text-carbon-700 font-bold focus:ring-0 cursor-pointer"
          />
        </div>
      </header>

      {dailySummary && <StatsGrid data={dailySummary} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by Payment Method */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-sage-100 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-carbon-900">Ventas por Método de Pago</h3>
            <p className="text-sm text-carbon-500 font-medium">Distribución de ingresos en el día</p>
          </div>
          {dailySummary && <SalesOverviewChart data={dailySummary.salesSummary.byPaymentMethod} />}
        </div>

        {/* Top Selling Products */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-sage-100 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-carbon-900">Ranking de Productos</h3>
            <p className="text-sm text-carbon-500 font-medium">Los 5 artículos más vendidos</p>
          </div>
          {topProducts && <TopProductsChart data={topProducts} />}
        </div>
      </div>
    </div>
  );
};
