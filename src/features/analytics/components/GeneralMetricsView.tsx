import { Skeleton } from "@/components";
import { useAnalytics } from "../hooks/useAnalytics";
import { AlertCircle, TrendingUp, DollarSign, ShoppingBag, Activity } from "lucide-react";
import { formatCurrency } from "@/utils/formatUtils";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

export const GeneralMetricsView = () => {
  const { dailySummary, isLoading, isError } = useAnalytics();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} variant="stat" className="rounded-3xl" />
          ))}
        </div>
        <Skeleton className="h-[400px] w-full rounded-3xl" />
      </div>
    );
  }
  if (isError || !dailySummary) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] text-error-500 bg-error-50 rounded-3xl">
        <AlertCircle className="w-10 h-10 mb-2" />
        <p>Error cargando métricas generales</p>
      </div>
    );
  }

  const salesData = [
    { name: "Ingresos Brutos", value: dailySummary.salesSummary.totalSold, color: "#10b981" },
    { name: "Gastos", value: dailySummary.totalExpenses, color: "#ef4444" },
    { name: "Neto", value: dailySummary.netBalance, color: "#3b82f6" },
  ];

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-sage-200/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-success-50 text-success-600 rounded-2xl">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-carbon-500">Ventas Totales</p>
              <h3 className="text-2xl font-bold text-carbon-900">
                {formatCurrency(dailySummary.salesSummary.totalSold)}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-sage-200/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-carbon-500">Órdenes Hoy</p>
              <h3 className="text-2xl font-bold text-carbon-900">
                {dailySummary.salesSummary.orderCount}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-sage-200/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-warning-50 text-warning-600 rounded-2xl">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-carbon-500">Portacomidas</p>
              <h3 className="text-2xl font-bold text-carbon-900">
                {dailySummary.salesSummary.packagingCount || 0}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-sage-200/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-carbon-500">Balance Neto</p>
              <h3 className="text-2xl font-bold text-carbon-900">
                {formatCurrency(dailySummary.netBalance)}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-sage-200/50">
        <h3 className="text-lg font-semibold text-carbon-900 mb-6">Desglose Financiero</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={salesData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {salesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(val: number) => formatCurrency(val)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
