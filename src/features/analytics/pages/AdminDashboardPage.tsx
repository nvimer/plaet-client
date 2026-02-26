import React, { useState } from "react";
import { useAnalytics } from "../hooks/useAnalytics";
import { StatsGrid } from "../components/StatsGrid";
import { SalesOverviewChart } from "../components/SalesOverviewChart";
import { TopProductsChart } from "../components/TopProductsChart";
import { Skeleton } from "@/components/ui/Skeleton/Skeleton";
import { BarChart3, Calendar, RefreshCcw, AlertCircle, LayoutGrid, ShoppingCart, PieChart, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/Button/Button";
import { cn } from "@/utils/cn";
import { SidebarLayout } from "@/layouts/SidebarLayout";

/**
 * ADMIN DASHBOARD PAGE
 * Professional administrative view with sales, expenses and performance charts.
 */
export const AdminDashboardPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const { dailySummary, topProducts, isLoading, isError, refetch } = useAnalytics(selectedDate);

  if (isLoading) {
    return (
      <SidebarLayout hideHeader fullWidth>
        <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <Skeleton className="h-12 w-64 rounded-2xl" />
            <Skeleton className="h-12 w-48 rounded-2xl" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full rounded-3xl" />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-[450px] w-full rounded-3xl" />
            <Skeleton className="h-[450px] w-full rounded-3xl" />
          </div>
        </div>
      </SidebarLayout>
    );
  }

  if (isError) {
    return (
      <SidebarLayout hideHeader fullWidth>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center px-4">
          <div className="w-20 h-20 bg-error-50 rounded-3xl flex items-center justify-center shadow-inner">
            <AlertCircle className="w-10 h-10 text-error-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-carbon-900 tracking-tight">Error al cargar estadísticas</h2>
            <p className="text-carbon-500 max-w-xs mx-auto">No pudimos conectar con el servidor de analítica. Por favor reintenta.</p>
          </div>
          <Button onClick={() => refetch()} className="gap-2 rounded-2xl h-12 px-8 font-bold shadow-soft-md">
            <RefreshCcw className="w-4 h-4" /> Reintentar
          </Button>
        </div>
      </SidebarLayout>
    );
  }

  const hasSales = (dailySummary?.salesSummary?.totalSold || 0) > 0;

  return (
    <SidebarLayout hideHeader fullWidth>
      <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto pb-24">
      {/* Professional Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-sage-600">
            <BarChart3 className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Panel Administrativo</span>
          </div>
          <h1 className="text-3xl font-bold text-carbon-900 tracking-tight">Análisis de Rendimiento</h1>
          <p className="text-sm text-carbon-500 font-medium">Visualiza el pulso comercial de tu restaurante en tiempo real.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl shadow-smooth-md border border-sage-100 ring-4 ring-sage-50/50">
          <div className="flex items-center gap-2 px-3 py-2 bg-sage-50 rounded-xl text-sage-700">
            <Calendar className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Fecha</span>
          </div>
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent border-none text-carbon-900 font-bold text-sm focus:ring-0 cursor-pointer pr-4"
          />
        </div>
      </header>

      {/* KPI Stats Grid */}
      {dailySummary && <StatsGrid data={dailySummary} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales by Payment Method */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-smooth-lg border border-sage-50 space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-carbon-900 tracking-tight">Ingresos por Método</h3>
              <p className="text-xs text-carbon-400 font-medium">Distribución monetaria del día</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-info-50 text-info-600 flex items-center justify-center">
              <PieChart className="w-5 h-5" />
            </div>
          </div>
          
          <div className="min-h-[320px] flex flex-col justify-center">
            {hasSales ? (
              <SalesOverviewChart data={dailySummary?.salesSummary?.byPaymentMethod} />
            ) : (
              <div className="flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-16 h-16 bg-sage-50 rounded-2xl flex items-center justify-center text-sage-200">
                  <LayoutGrid className="w-8 h-8" />
                </div>
                <p className="text-sm text-carbon-400 font-medium italic">Sin datos de ventas registrados hoy</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-smooth-lg border border-sage-50 space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-carbon-900 tracking-tight">Ranking de Ventas</h3>
              <p className="text-xs text-carbon-400 font-medium">Productos estrella del periodo</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-success-50 text-success-600 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 rotate-180" />
            </div>
          </div>
          
          <div className="min-h-[320px]">
            {topProducts && topProducts.length > 0 ? (
              <TopProductsChart data={topProducts} />
            ) : (
              <div className="flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-16 h-16 bg-sage-50 rounded-2xl flex items-center justify-center text-sage-200">
                  <ShoppingCart className="w-8 h-8" />
                </div>
                <p className="text-sm text-carbon-400 font-medium italic">Sin productos vendidos para mostrar</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Extra Detail: Sales by Category */}
      {hasSales && dailySummary?.salesSummary?.byCategory && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-smooth-lg border border-sage-50">
          <div className="mb-8">
            <h3 className="text-lg font-bold text-carbon-900 tracking-tight">Rendimiento por Categoría</h3>
            <p className="text-xs text-carbon-400 font-medium">¿Qué rubros están generando más ingresos?</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {dailySummary.salesSummary.byCategory.map((cat: any, index: number) => (
              <div key={index} className="p-4 bg-sage-50/50 border border-sage-100 rounded-2xl space-y-2">
                <p className="text-[10px] font-bold text-carbon-400 uppercase tracking-widest truncate">{cat.name}</p>
                <p className="text-lg font-bold text-carbon-900">${Number(cat.total).toLocaleString("es-CO")}</p>
                <div className="w-full h-1.5 bg-sage-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-sage-500 rounded-full" 
                    style={{ width: `${Math.min(100, (cat.total / (dailySummary.salesSummary.totalSold || 1)) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
                </div>
              )}
            </SidebarLayout>
          );
        };
        